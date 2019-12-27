'use strict';

const to = require('await-to-js').default;
const HttpUtil = require('../Utils/http');
const Utils = require('../Utils');
const BaseController = require('./BaseController');
const Model = require('../Models/Order');
const Services = require('../Services/orders');

class OrderController extends BaseController {
  constructor() {
    super(OrderController);
    this.model = Model;
    this.requireParams = {
      ...this.requireParams,
      store: [
        'customer', 'area', 'deliveryDate', 'deliveryTime', 'deliveryAddress',
        {name: 'orderDetails', dataType: 'array'}
      ],
      update: [
        'customer', 'area', 'deliveryDate', 'deliveryTime', 'deliveryAddress',
        {name: 'orderDetails', dataType: 'array'}
      ],
      divide: ['date', 'driver', {name: 'ids', dataType: 'array'}]
    }
  }

  async load(req, res, next, id) {
    return super.load(req, res, next, id)
  }

  async index(req, res) {
    return super.index(req, res)
  }

  detail(req, res) {
    return super.detail(req, res)
  }

  async store(req, res) {
    let params = HttpUtil.getRequiredParamsFromJson2(req, this.requireParams.store);
    if (params.error) return HttpUtil.badRequest(res, params.error);

    let err, customer;
    [err, customer] = await to(Services.validateRelation(params, 'customer'));
    if (err) return HttpUtil.unprocessable(res, err);

    let area;
    [err, area] = await to(Services.validateRelation(params, 'area'));
    if (err) return HttpUtil.unprocessable(res, err);

    params = Services.genDataStore(params);
    params.code = Services.setOrderCode(area, customer);
    let result;
    [err, result] = await to(this.model.insertOne(params, req.authUser));
    if (err) return HttpUtil.internalServerError(res, Utils.localizedText('Errors.create', err.message));
    delete result.__v; // not copy version;

    return HttpUtil.success(res, result, 'Success.create');
  }

  async update(req, res) {
    let object = req.object;
    if (!object) return HttpUtil.badRequest(res, 'Not_Founds.Request_Object')

    let params = HttpUtil.getRequiredParamsFromJson2(req, this.requireParams.update);
    if (params.error) return HttpUtil.badRequest(res, params.error);

    if (params.status && params.status !== object.status) {
      return HttpUtil.unprocessable(res, 'Errors.Cannot_Change_Order_Status')
    }

    let err, result;
    if (params.customer.toString() !== object.customer.toString()) {
      [err, result] = await to(Services.validateRelation(params, 'customer'));
      if (err) return HttpUtil.unprocessable(res, err);
    }

    if (params.area.toString() !== object.area.toString()) {
      [err, result] = await to(Services.validateRelation(params, 'area'));
      if (err) return HttpUtil.unprocessable(res, err);
    }

    params = Services.genDataStore(params);
    [err, result] = await to(this.model.updateOne(object._id, params, {}, req.authUser));
    if (err) return HttpUtil.internalServerError(res, Utils.localizedText('Errors.update', err.message));

    return HttpUtil.success(res, 'Success.update');
  }

  async destroy(req, res) {
    return super.destroy(req, res);
  }

  async deleteMulti(req, res) {
    return super.deleteMulti(req, res)
  }

  async fakeData(req, res) {
    let [err, rs] = await to(Services.fakeDataOrder(req.query.date));
    if (err) return HttpUtil.internalServerError(res, err)

    return HttpUtil.success(res, rs);
  }
}

module.exports = new OrderController()
