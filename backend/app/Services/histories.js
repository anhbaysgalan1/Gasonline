'use strict';

const moment = require('moment');
const to = require('await-to-js').default;
const DateUtil = require('../Utils/date');
const Utils = require('../Utils');
const Model = require('../Models/History');
const ModelArea = require('../Models/Area');
const ModelCustomer = require('../Models/Customer');
const ModelOrder = require('../Models/Order');
const ModelUser = require('../Models/User');
const ModelVehicle = require('../Models/Vehicle');
const {customerTypes, middleMonth} = require('../../config');
let settings = require('../../config/setting.json');

class Services {
  constructor() {
    this.model = Model;
    this.mArea = ModelArea;
    this.mCustomer = ModelCustomer;
    this.mDriver = ModelUser;
    this.mOrder = ModelOrder;
    this.mVehicle = ModelVehicle;
  }

  async getVehicleForDriver(driver) {
    let [err, vehicle] = await to(this.mVehicle.getOne({driver: driver._id}));
    if (err) throw Error(Utils.localizedText('Found_Errors.vehicle', err.message));
    if (!vehicle) throw Error(Utils.localizedText('Not_Founds.Vehicle_Of_Driver', driver.email));
    return vehicle
  }

  async getOrderForExport(orderId) {
    let [err, order] = await to(this.mOrder.getOneWithRelation({_id: orderId}));
    if (err) throw Error(Utils.localizedText('Found_Errors.order', err.message));
    if (!order) throw Error(Utils.localizedText('Not_Founds.order', orderId));
    return order
  }

  async updateRemainingFuelsForVehicle(vehicle, remains, authUser = null) {
    return await this.mVehicle.updateOne(vehicle._id, {remain: remains}, {}, authUser)
  }

  changeNumberRemainingFuels(obj, material, quantity, increase = true) {
    let value = obj[material] ? parseInt(obj[material]) : 0;
    if (increase) {
      value += quantity
    } else {
      value -= quantity
    }
    return value
  }

  formatExportDetail(item, customer) {
    let {insurance, prices, taxes} = settings;
    let {material} = item;
    let obj = {
      ...item,
      price: 0,
      extraPrice: customer.extraPrice,
      tax: parseInt(taxes.consumptionTax),
      dieselTax: material === 'diesel' ? parseInt(taxes.dieselTax) : 0
    };
    if (customer.type === customerTypes.mediate) obj.insurance = parseInt(insurance);
    if (material === 'adBlue') {
      obj.price = parseInt(prices.adBlue)
    } else {
      if (material === 'dieselFreeTax') material = 'diesel';
      if (customer.type === customerTypes.mediate) {
        if (material === 'diesel') {
          let flag = `flag${customer.flag}`;
          obj.price = parseInt(prices['mcCenter'][material][flag]) || 0
        } else {
          obj.price = parseInt(prices['mcCenter'][material]) || 0
        }
      } else {
        let day = moment().format('DD');
        if (Number(day) > middleMonth) {
          obj.price = parseInt(prices['ske']['endMonth'][material]) || 0
        } else {
          obj.price = parseInt(prices['ske']['startMonth'][material]) || 0
        }
      }
    }
    return obj
  }

  validateExportFuelDetails(vehicle, details) {
    let remainingFuels = vehicle.remain;
    let err = [], diesel = 0;
    details.map(detail => {
      let {material, quantity} = detail;
      if (material.includes('diesel')) {
        diesel += quantity;
      } else {
        let remain = remainingFuels[material] || 0;
        if (quantity > remain) {
          err.push(Utils.localizedText(`Products.${material}`))
        } else {
          remainingFuels[material] -= quantity
        }
      }
    });
    let remainingDiesel = remainingFuels['diesel'] || 0;
    if (diesel && diesel > remainingDiesel) {
      err.push(Utils.localizedText(`Products.diesel`))
    } else {
      remainingFuels['diesel'] -= diesel
    }
    if (err.length) return [Utils.localizedText('Errors.Not_Enough_Fuels', err.join(', '))];
    return [null, remainingFuels]
  }

  async getDataInvoice(params) {
    let filters = {
      type: params.type || customerTypes.mediate
    }
    if (params.paymentTerm) filters.paymentTerm = params.paymentTerm;
    if (params.customer) filters._id = params.customer;

    let err, customers;
    let projection = {insert: 0, update: 0, __v: 0};
    [err, customers] = await to(this.mCustomer.findByCondition(filters, false, projection));
    if (err) throw Error(Utils.localizedText('Found_Errors.customer', err.message));
    if (!customers.length) return {};

    let customerLists = {}, customerIds = [];
    customers.map(customer => {
      customerIds.push(customer._id);
      customerLists[customer._id] = customer;
    });
    //lấy lịch sử của các customer bên trên
    let conditions = {
      customer: {$in: customerIds},
      'insert.when': {
        $gte: DateUtil.getStartOfDate(params.startDate),
        $lte: DateUtil.getEndOftDate(params.endDate)
      }
    };

    let histories;
    [err, histories] = await to(this.model.findByCondition(conditions));
    if (err) throw Error(Utils.localizedText('Load_Lists_Errors.history', err.message));
    return {histories, customers: customerLists}
  }

  makeDataInvoice(histories, customers, type) {
    if (Utils.isString(type)) type = parseInt(type);
    //convert lại dữ liệu cho đẹp
    let data = this.formatDataInvoice(histories);
    let lists = [], total = {};
    for (let key in data) {
      let customer = customers[key];
      let dataCustomer = data[key];
      lists.push({
        customer,
        ...dataCustomer
      });
      if (type === customerTypes.mediate) {
        for (let item in dataCustomer) {
          if (total[item] === undefined) {
            total[item] = dataCustomer[item]
          } else {
            total[item] += dataCustomer[item]
          }
        }
      }
    }
    return {total, lists};
  }

  formatDataInvoice(histories) {
    let result = {}
    for (let history of histories) {
      let {customer, details} = history;
      let obj = result[customer] || {};
      details.map(detail => {
        let {material, quantity, tax, price, extraPrice} = detail;
        let dieselTax = detail.dieselTax || 0;
        let amount = quantity * (price + extraPrice) * (tax + dieselTax + 100) / 100;
        if (obj.amount === undefined) {
          obj.amount = amount;
        } else {
          obj.amount += amount;
        }
        if (obj[material] === undefined) {
          obj[material] = quantity;
        } else {
          obj[material] += quantity;
        }
      })
      result[customer] = obj;
    }
    return result;
  }

  // data for PDF of invoice - MC Center
  makeDataPdfIMC(histories, customers) {
    //convert lại dữ liệu cho đẹp
    let data = this.formatDataPdfIMC(histories);
    let lists = {};
    for (let key in data) {
      let dataCustomer = data[key];
      for (let material in dataCustomer) {
        let obj = dataCustomer[material];
        let detail = {...obj, customer: key};
        if (lists[material]) {
          lists[material].data.push(detail);
          lists[material].total = this.sumTotalInvoiceForMCCenter(lists[material].total, obj);
        } else {
          lists[material] = {
            data: [detail],
            total: {...obj}
          };
        }
      }
    }
    return {lists, customers};
  }

  sumTotalInvoiceForMCCenter(currentObj, additionObj) {
    let obj = {};
    ['quantity', 'amount', 'amountTax', 'amountDieselTax'].map(key => {
      obj[key] = currentObj[key] + additionObj[key]
    });
    return obj;
  }

  formatDataPdfIMC(histories) {
    let result = {}
    for (let history of histories) {
      let {customer, details} = history;
      let obj = result[customer] || {};
      details.map(detail => {
        let {material, quantity, tax, price, extraPrice} = detail;
        if (material.includes('diesel')) material = 'diesel';
        let dieselTax = detail.dieselTax || 0;
        let amount = quantity * (price + extraPrice);
        let amountTax = (amount * tax) / 100;
        let amountDieselTax = (amount * dieselTax) / 100;
        if (obj[material]) {
          obj[material].quantity += quantity;
          obj[material].amount += amount;
          obj[material].amountTax += amountTax;
          obj[material].amountDieselTax += amountDieselTax;
        } else {
          obj[material] = {
            quantity,
            amount,
            amountTax,
            amountDieselTax
          };
        }
      })
      result[customer] = obj;
    }
    return result;
  }

  async fakeDataHistories(authUser) {
    let err, result, orders, vehicle;
    [err, orders] = await to(this.mOrder.findByCondition({driver: authUser._id}, true));
    if (err) throw Error(`Load orders by driver failed: ${err.message}`);
    if (!orders.length) throw Error('No orders found');

    [err, vehicle] = await to(this.getVehicleForDriver(authUser));
    if (err) throw Error(err.message);

    let data = [];
    let details = [
      {material: 'dieselFreeTax', quantity: 200},
      {material: 'diesel', quantity: 500},
      {material: 'kerosene', quantity: 200},
      {material: 'gasoline', quantity: 2000},
      {material: 'adBlue', quantity: 150}
    ];
    let obj = {
      type: 2,
      driver: authUser._id,
      vehicle: vehicle._id
    };

    orders.map(order => {
      let arrD = [...details];
      arrD = arrD.map(item => this.formatExportDetail(item, order.customer));
      data.push({
        ...obj,
        details: arrD,
        customer: order.customer._id,
        order: order._id
      });
    });

    [err, result] = await to(this.model.insertMany(data));
    if (err) throw Error(`Fake histories failed: ${err.message}`);
    return result
  }
}

module.exports = new Services()
