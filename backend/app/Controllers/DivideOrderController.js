'use strict';

const to = require('await-to-js').default;
const DateUtil = require('../Utils/date');
const HttpUtil = require('../Utils/http');
const Utils = require('../Utils');
const BaseController = require('./BaseController');
const Model = require('../Models/Order');
const Service = require('../Services/orders');

class DivideOrderController extends BaseController {
  constructor() {
    super(DivideOrderController);
    this.model = Model;
    this.service = Service;
    this.requireParams = {
      ...this.requireParams,
      store: ['date', 'driver', {name: 'ids', dataType: 'array'}],
      update: [
        'customer', 'area', 'deliveryDate', 'deliveryTime', 'deliveryAddress',
        {name: 'orderDetails', dataType: 'array'}
      ],
    }
  }

  async load(req, res, next, id) {
    return super.load(req, res, next, id)
  }

  detail(req, res) {
    return super.detail(req, res)
  }

  async destroy(req, res) {
    return super.destroy(req, res);
  }

  // get list orders for divide
  // params: date (YYYY-MM-DD)
  async index(req, res) {
    let {currentPage, pageSize, date} = req.query;
    let page = currentPage ? parseInt(currentPage) : 0
    let perPage = pageSize ? parseInt(pageSize) : -1

    let options = {
      perPage: perPage,
      page: page,
      filters: {
        deliveryDate: {
          $gte: DateUtil.getStartOfDate(date),
          $lte: DateUtil.getEndOftDate(date)
        }
      },
      sorts: null
    }

    let [err, lists] = await to(this.model.lists(options));
    if (err) return HttpUtil.internalServerError(res, Utils.localizedText('Errors.Get_Orders_Daily_Failed', err.message));

    return HttpUtil.success(res, lists);
  }

  // divide orders
  async store(req, res) {
    let params = HttpUtil.getRequiredParamsFromJson2(req, this.requireParams.store);
    if (params.error) return HttpUtil.badRequest(res, params.error);

    let err, result;
    [err, params] = await to(this.service.validateBeforeDivide(params));
    if (err) return HttpUtil.unprocessable(res, err);

    [err, result] = await to(this.service.divideOrders(params));
    if (err) return HttpUtil.internalServerError(res, err)
    return HttpUtil.success(res, result)
  }

  // sort divided orders
  async update(req, res) {

  }

  async fakeData(req, res) {
    let [err, result] = await to(this.service.fakeDataDividedOrder());
    if (err) return HttpUtil.internalServerError(res, err);
    return HttpUtil.success(res, result);
  }
}

module.exports = new DivideOrderController()
