'use strict';

const _ = require('lodash');
const moment = require('moment');
const to = require('await-to-js').default;
const BaseController = require('./BaseController');
const DateUtil = require('../Utils/date');
const HttpUtil = require('../Utils/http');
const Utils = require('../Utils');
const Model = require('../Models/History');
const AreaModel = require('../Models/Area');
const CustomerModel = require('../Models/Customer');
const OrderModel = require('../Models/Order');
const UserModel = require('../Models/User');
const PDF = require('../../services/pdf');
const Services = require('../Services/histories');
const config = require('../../config');
const dayInWeek = [
  Utils.localizedText("DayInWeek.sunday"),
  Utils.localizedText("DayInWeek.monday"),
  Utils.localizedText("DayInWeek.tuesday"),
  Utils.localizedText("DayInWeek.wednesday"),
  Utils.localizedText("DayInWeek.thursday"),
  Utils.localizedText("DayInWeek.friday"),
  Utils.localizedText("DayInWeek.saturday")
];

class Controller extends BaseController {
  constructor() {
    super(Controller)
    this.model = Model;
    this.services = Services;
    this.requireParams = {
      ...this.requireParams,
      store: ['name'],
      update: ['name']
    }
    this.validate = {
      unique: [
        {
          key: 'name',
          error: 'Found_Errors.general',
          message: 'Exists.general'
        }
      ]
    }
  }

  async load(req, res, next, id) {
    return super.load(req, res, next, id)
  }

  async index(req, res) {
    const date = req.params.date;
    if (!date) return HttpUtil.badRequest(res, "Date required!");

    let conditions = {
      'insert.when': {
        $gte: DateUtil.getStartOfDate(date),
        $lte: DateUtil.getEndOftDate(date)
      },
      type: config.typePouring.export
    }

    let [err, histories] = await to(this.model.findByCondition(conditions));
    let data = {};
    for (let history of histories) {
      let { customer, order, driver, details } = history;
      if (!data[order]) {
        let [customerInfo, orderInfo, driverInfo] = await Promise.all([
          CustomerModel.getOne({ _id: customer }),
          OrderModel.getOne({ _id: order }),
          UserModel.getOne({ _id: driver })
        ])
        if(!orderInfo) {
          console.log(history._id, "order not found!!!")
          continue;
        }
        let areaInfo = await AreaModel.getOne({ _id: orderInfo.area })

        data[order] = {
          orderInfo: orderInfo,
          customerInfo: customerInfo,
          areaInfo: areaInfo,
          driverInfo: driverInfo,
          quantity: {}
        }
      }

      //cộng detail theo từng order
      for (let detail of details) {
        const { material, quantity } = detail;
        if (!data[order]["quantity"][material]) data[order]["quantity"][material] = 0;
        data[order]["quantity"][material] += quantity;
      }
    }
    data = Object.values(data)
    let result = {
      1: [], //ske
      2: [] //mc center
    }

    for (let user of data) {
      let type = user.customerInfo.type
      result[type].push(user)
    }

    let content = await this.makeDailyReportFormat({ data: result, date });
    //res.send(content)
    res.pdf(content)
  }

  async makeDailyReportFormat({ data, date }) {
    const ITEM_PER_PAGE = 30; //số lượng dữ liệu hiển thị trong 1 trang
    const ROW_PER_PAGE = 40; //số lượng dòng trong 1 trang
    const template = "/views/reports/daily-report.html"
    const maxRow = Math.max(data[1].length, data[2].length)
    const productKeys = [...Object.keys(config.products), "dieselFeeTax"]

    let rootContent = "";
    let table1 = [], table2 = [], totalTable1 = {}, totalTable2 = {}, page = 1;
    //lặp từng bản ghi để chia cho các trang
    for (let i = 0; i < maxRow; i++) {
      //chuẩn bị dữ liệu để render từng trang;
      table1.push(data[1][i])
      table2.push(data[2][i])

      //dữ liệu total cho table;
      for (let key of productKeys) {
        if (!totalTable1[key]) totalTable1[key] = 0;
        if (!totalTable2[key]) totalTable2[key] = 0;
        totalTable1[key] += _.get(data, `[1][${i}].quantity.${key}`, 0);
        totalTable2[key] += _.get(data, `[2][${i}].quantity.${key}`, 0);
      }

      //build content của 1 trang
      if (((i + 1) % ITEM_PER_PAGE === 0) || i == maxRow - 1) {
        rootContent += await PDF.renderTemplate(template, {
          table1,
          table2,
          totalTable1,
          totalTable2,
          date: {
            year: moment(date).format("YYYY"),
            month: moment(date).format("MM"),
            day: moment(date).format("DD"),
            dayInWeek: dayInWeek[moment(date).format("e")],
          },
          page,
          rowPerPage: ROW_PER_PAGE
        });
        //reset data for nextPage
        table1 = [];
        table2 = [];
        totalTable1 = {};
        totalTable2 = {};
        page++;
      }

    }

    //xử lý trường hợp không có bản ghi nào trong ngày
    if (!rootContent) {
      rootContent += await PDF.renderTemplate(template, {
        table1,
        table2,
        totalTable1,
        totalTable2,
        date: {
          year: moment(date).format("YYYY"),
          month: moment(date).format("MM"),
          day: moment(date).format("DD"),
          dayInWeek: dayInWeek[moment(date).format("e")],
        },
        page: 1,
        rowPerPage: ROW_PER_PAGE
      });
    }
    //return rootContent;
    let content = await PDF.makePdf(rootContent, {
      format: 'A3',
      landscape: true,
      printBackground: true,
      margin: {
        top: '10mm',
        bottom: '0mm',
        left: '10mm',
        right: '10mm'
      }
    })
    return content;
  }

  async getInvoiceList(req, res) {
    const requireParams = ["type", "startDate", "endDate"];
    let params = HttpUtil.getRequiredParamsFromUrl(req, requireParams);
    if (params.error) return HttpUtil.badRequest(res, params.error);

    const allowParams = [...requireParams, 'paymentTerm', 'customer'];
    params = Utils.getAcceptableFields(params, allowParams);

    let [err, result] = await to(this.services.getDataInvoice(params));
    if (err) return HttpUtil.unprocessable(res, err);
    if (Object.keys(result).length) {
      result = this.services.makeDataInvoice(result.histories, result.customers, params.type)
    }
    return HttpUtil.success(res, result)
  }

  async previewInvoiceMCCenter(req, res) {
    const requireParams = ["startDate", "endDate"];
    let params = HttpUtil.getRequiredParams(req, requireParams);
    if (params.error) return HttpUtil.badRequest(res, params.error);

    const allowParams = [...requireParams, 'paymentTerm', 'customer'];
    params = Utils.getAcceptableFields(params, allowParams);

    let [err, result] = await to(this.services.getDataInvoice(params));
    if (err) return HttpUtil.unprocessable(res, err);
    if (Object.keys(result).length) {
      result = this.services.makeDataPdfIMC(result.histories, result.customers)
    }
    let content = await this.makeInvoiceMCContent(result);
    const pdfContent = await PDF.makePdf(content,{
      format: 'A4',
      landscape: false,
      printBackground: true,
      margin: {
        top: '10mm',
        bottom: '0mm',
        left: '10mm',
        right: '10mm'
      }
    })
    return res.pdf(pdfContent)
  }

  async makeInvoiceMCContent(histories){
    const ROW_PER_PAGE = 50;
    let rootContent = "";
    let dataTable = []
    let totalAmount = 0;
    for(let material in histories.lists){
      let data = histories.lists[material].data
      let total = histories.lists[material].total
      for(let row of data){
        dataTable.push({
          2: histories.customers[row.customer].name,
          3: row.quantity,
          4: row.amount,
          5: row.amountTax,
          6: row.amountDieselTax,
          7: row.bh
        })
      }
      dataTable.push({
        1: Utils.localizedText(`Products.${material}`),
        2: "合計",
        3: total.quantity,
        4: total.amount,
        5: total.amountTax,
        6: total.amountDieselTax,
        7: total.bh,
        style: 'border-double'
      })
      dataTable.push({style: "border-line"})
      totalAmount += total.amount + total.amountTax + total.amountDieselTax
    }

    dataTable.push({
      6: "消費税",
    })
    dataTable.push({
      2: "消費税",
      3: 0,
      4: 0,
      5: 0,
      6: 0
    })

    const template = "/views/reports/invoice-mc.ejs"
    let content = await PDF.renderTemplate(template, {
      data: dataTable,
      page: 1,
      total: totalAmount,
      customer: {name: '東洋アース興業　株式会社'},
      date: {
        year: moment().format("YYYY"),
        month: moment().format("MM"),
        day: moment().format("DD"),
      },

    })
    return content;
  }

  async invoiceDetail(req, res) {
    const paramField = ["customerId", "from", "to"]
    let params = HttpUtil.getRequiredParams(req, paramField);
    if (params.error) {
      return HttpUtil.badRequest(res, params.error);
    }
    let fromDate = moment(params.from, "YYYYMMDD").startOf("day").toDate();
    let toDate = moment(params.to, "YYYYMMDD").endOf("day").toDate();
    let content = await this.makeInvoiceContent({
      fromDate,
      toDate,
      customerId: params.customerId
    })
    const pdfContent = await PDF.makePdf(content,{
      format: 'A4',
      landscape: false,
      printBackground: true,
      margin: {
        top: '10mm',
        bottom: '0mm',
        left: '10mm',
        right: '10mm'
      }
    })
    return res.pdf(pdfContent)
  }

  async invoiceDetailAll(req, res) {
    const paramField = ["type", "from", "to", "paymentTerm"]
    let params = HttpUtil.getRequiredParams(req, paramField);
    if (params.error) {
      return HttpUtil.badRequest(res, params.error);
    }
    let fromDate = moment(params.from, "YYYYMMDD").startOf("day").toDate();
    let toDate = moment(params.to, "YYYYMMDD").endOf("day").toDate();
    let customers = await CustomerModel.findByCondition({
      type: params.type,
      paymentTerm: params.paymentTerm
    })
    let content = "";
    for(let customer of customers){
      content += await this.makeInvoiceContent({
        fromDate,
        toDate,
        customerId: customer._id
      })
    }
    const pdfContent = await PDF.makePdf(content,{
      format: 'A4',
      landscape: false,
      printBackground: true,
      margin: {
        top: '10mm',
        bottom: '0mm',
        left: '10mm',
        right: '10mm'
      }
    })
    return res.pdf(pdfContent)
  }


  async makeInvoiceContent({ fromDate, toDate, customerId, removeEmpty = false, groupBy = "order", breakPageWhenChange = false }) {
    const ITEM_PER_PAGE = 50;
    const ROW_PER_PAGE = 50;

    let data = await this.model.getInvoiceByCustomer({ fromDate, toDate, customerId: customerId, groupBy });
    if(removeEmpty && data.length == 0){
      return "";
    }
    let customer = await CustomerModel.getOne({ _id: customerId })
    let template;
    //nếu là khách hàng của MC center, thì đổi tên xuống subname
    if(customer.type == 2){
      customer.subName = customer.name;
      customer.name = '東洋アース興業　株式会社'
      template = "/views/reports/invoice-customer-mc.ejs"
    }
    else{
      template = "/views/reports/invoice-customer-direct.ejs"
    }
    let dataTable = new DataTable();
    for (let i = 0; i < data.length; i++) {
      data[i] = { //thêm 1 số trường vào object data
        ...data[i],
        month: moment(data[i]['date']).format("M"),
        day: moment(data[i]['date']).format("D"),
        name: Utils.localizedText(`Products.${data[i].material}`)
      }
      dataTable.pushData(data[i]);

      let nextData = data[i + 1] || {}

      //ngắt trang nếu thỏa mãn các điều kiện: max item,  thay đổi thuế....
      if (((dataTable.getDataCount() + 1) > ITEM_PER_PAGE)
        || (nextData.customer && String(nextData.customer._id) != String(data[i].customer._id))
      ) {
        dataTable.pushEmpty(ROW_PER_PAGE - dataTable.getDataCount() - 3);
        dataTable.addSubSum();
        dataTable.nextPage();
      }
      else if(
        //nếu hết material thì add tổng phụ
        nextData.dieselTax != data[i].dieselTax
      || (nextData.tax != data[i].tax)
      || (nextData.material != data[i].material)){
        //chuyển trang nếu thay đổi thuế hoặc loại sản phẩm
        if(breakPageWhenChange && nextData.material){
          dataTable.pushEmpty(ROW_PER_PAGE - dataTable.getDataCount() - 3)
          dataTable.addSubSum();
          dataTable.nextPage();
        }
        else{
          //nếu là item cuối cùng thì fill thêm dòng trống
          if(!nextData.material){
            dataTable.pushEmpty(ROW_PER_PAGE - dataTable.getDataCount() - 12);
          }
          dataTable.addSubSum();
        }
      }

    }
    if(ROW_PER_PAGE - dataTable.getDataCount() < 9){
      dataTable.nextPage();
      dataTable.pushEmpty(ITEM_PER_PAGE - 5)
    }
    if(groupBy == "order"){
      dataTable.addSummary();
    }
    else{
      dataTable.addSummaryCar();
    }

    let rootContent = "";
      for(let page in dataTable.data){
        rootContent += await PDF.renderTemplate(template, {
          data: dataTable.data[page],
          page,
          total: dataTable.totalAmount,
          customer: customer,
          date: {
            year: moment().format("YYYY"),
            month: moment().format("MM"),
            day: moment().format("DD"),
          },

        })
      }
      return rootContent;
  }

  async invoiceDetailCar(req, res) {
    const paramField = ["customerId", "from", "to"]
    let params = HttpUtil.getRequiredParams(req, paramField);
    if (params.error) {
      return HttpUtil.badRequest(res, params.error);
    }
    let fromDate = moment(params.from, "YYYYMMDD").startOf("day").toDate();
    let toDate = moment(params.to, "YYYYMMDD").endOf("day").toDate();
    let content = await this.makeInvoiceContent({
      fromDate,
      toDate,
      customerId: params.customerId,
      groupBy: "car",
      breakPageWhenChange: true
    })
    const pdfContent = await PDF.makePdf(content,{
      format: 'A4',
      landscape: false,
      printBackground: true,
      margin: {
        top: '10mm',
        bottom: '0mm',
        left: '10mm',
        right: '10mm'
      }
    })
    return res.pdf(pdfContent)
  }
}

class DataTable {
  constructor(){
    this.data = [[]];
    this.overAll = {}
    this.pageTotal = {quantity: 0, amount: 0, tax: 0, dieselTax: 0}
    this.page = 0;
    this.pageSumary = [{quantity: 0, amount: 0, amountTax: 0, amountDieselTax: 0}]
  }

  resetPageTotal(){
    //tính tổng trang vào tổng to
    let {material, quantity, amount, tax, dieselTax, name} = this.pageTotal
    if(!material) return;
    if(!this.overAll[material]) this.overAll[material] = {
      quantity: 0,
      amount: 0,
      amountTax: 0,
      amountDieselTax: 0,
      name: name
    }

    this.overAll[material].quantity += quantity;
    this.overAll[material].amount += amount;
    this.overAll[material].amountTax += amount * tax;
    this.overAll[material].amountDieselTax += quantity * dieselTax;

    this.totalAmount = Object.values(this.overAll).reduce((sum, item) =>
    sum += item.amount + item.amountTax + item.amountDieselTax, 0)

    this.pageSumary[this.page].quantity += quantity
    this.pageSumary[this.page].amount += amount
    this.pageSumary[this.page].amountTax += amount * tax
    this.pageSumary[this.page].amountDieselTax += quantity * dieselTax

    this.pageTotal = {quantity: 0, amount: 0, tax: 0, dieselTax: 0}
  }

  nextPage(){
    this.resetPageTotal();
    this.page++;
    this.data[this.page] = [];
    this.pageSumary[this.page] = {quantity: 0, amount: 0, amountTax: 0, amountDieselTax: 0}
  }

  pushData(row){
    let price = row.price + row.extraPrice
    let amount = row.quantity * (row.price + row.extraPrice)
    this.data[this.page].push({
      0: row.month,
      1: row.day,
      2: row.name,
      3: row.quantity,
      4: price || "",
      5: amount || "",
      6: _.get(row, "order.deliveryAddress", ""),
      7: _.get(row, "vehicle.name", ""),
    })
    this.pageTotal.material = row.material
    this.pageTotal.name = row.name
    this.pageTotal.quantity += row.quantity
    this.pageTotal.amount += amount
    this.pageTotal.tax = row.tax;
    this.pageTotal.dieselTax = row.dieselTax;
    return this
  }
  pushEmpty(length, style){
    for(let i=0; i < length; i++) this.data[this.page].push({style})
  }

  addSubSum(){
    let {amount, quantity, tax, dieselTax} = this.pageTotal
    let amountTax = amount * tax;
    let amountDieselTax = quantity * dieselTax
    this.data[this.page].push({
      2: "小計",
      3: "数量",
      4: "金額",
      5: "消費税",
      6: `${dieselTax ? "軽油税": ""}`,
      style: "border-line"
    })
    this.data[this.page].push({
      3: quantity,
      4: amount,
      5: amountTax,
      6: amountDieselTax || ""
    })
    this.pushEmpty(1);
    this.resetPageTotal();
  }
  getDataCount(){
    return this.data[this.page].length
  }

  addSummary(){
    let showDiesel = this.overAll['diesel']? 1: 0
    this.pushEmpty(1, "border-double");
    this.data[this.page].push({
      2: "【合計】",
      3: "数量",
      4: "金額",
      5: "消費税",
      6: `${showDiesel ? "軽油税": ""}`,
    })
    for(let material in this.overAll){
      let info = this.overAll[material]
      this.data[this.page].push({
        2: info["name"],
        3: info["quantity"],
        4: info["amount"],
        5: info["amountTax"],
        6: info["amountDieselTax"] || ""
      })
    }

    this.data[this.page].push({
      5: this.totalAmount,
    })
  }

  addSummaryCar(){
    let showDiesel = this.overAll['diesel']? 1: 0
    this.pushEmpty(1, "border-double");
    this.data[this.page].push({
      2: "合計",
      3: "数量",
      4: "軽油税",
      5: "金額",
      6: "消費税",
    })
    for(let page in this.pageSumary){
      let info = this.pageSumary[page]
      this.data[this.page].push({
        2: `NO.${Number(page)+1}`,
        3: info["quantity"],
        4: info["amountDieselTax"],
        5: info["amount"],
        6: info["amountTax"]
      })
    }

    this.data[this.page].push({
      5: this.totalAmount,
    })
  }
}
module.exports = new Controller()
