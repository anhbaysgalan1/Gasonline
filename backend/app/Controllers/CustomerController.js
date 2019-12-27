'use strict';

const to = require('await-to-js').default;
const Utils = require('../Utils');
const HttpUtil = require('../Utils/http');
const BaseController = require('./BaseController');
const Model = require('../Models/Customer');
const {customerTypes} = require('../../config');

/**
 * CustomerController
 * Xem hàm mẫu BaseController nếu muốn viết lại các action
 */

class CustomerController extends BaseController {
  constructor() {
    super(CustomerController);
    this.model = Model
    this.requireParams = {
      ...this.requireParams,
      store: [
        'code',
        'name',
        'address',
        'phone',
        'paymentTerm',
        'type',
        'extraPrice'
      ],
      update: [
        'code',
        'name',
        'address',
        'phone',
        'paymentTerm',
        'type',
        'extraPrice'
      ]
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
    let requireParams = [...this.requireParams.store];
    if (req.body.type && req.body.type.toString() === customerTypes.mediate.toString()) {
      requireParams.push('flag')
    }
    let params = HttpUtil.getRequiredParamsFromJson2(req, requireParams);
    if (params.error) return HttpUtil.badRequest(res, params.error);

    params = Utils.getAcceptableFields(params, requireParams);
    let err, result;
    let condition = {code: params.code};
    [err, result] = await to(this.model.getOne(condition));
    if (err) return HttpUtil.internalServerError(res, Utils.localizedText('Found_Errors.customer', err.message));

    if (result) return HttpUtil.unprocessable(res, Utils.localizedText('Unique.customer.code', params.code));

    if (params.type.toString() === customerTypes.direct.toString()) delete params.flag;
    [err, result] = await to(this.model.insertOne(params, req.authUser));
    if (err) return HttpUtil.internalServerError(res, Utils.localizedText('Errors.create', err.message));
    delete result.__v; // not copy version;

    return HttpUtil.success(res, result, 'Success.create');
  }

  async update(req, res) {
    let object = req.object;
    if (!object) return HttpUtil.badRequest(res, 'Not_Founds.Request_Object')

    let requireParams = [...this.requireParams.update];
    if (req.body.type && req.body.type.toString() === customerTypes.mediate.toString()) {
      requireParams.push('flag')
    }

    let params = HttpUtil.getRequiredParamsFromJson2(req, requireParams);
    if (params.error) return HttpUtil.badRequest(res, params.error);

    params = Utils.getAcceptableFields(params, requireParams);
    let err, result;
    if (params.code !== object.code) {
      [err, result] = await to(this.model.getOne({code: params.code}));
      if (err) return HttpUtil.internalServerError(res, Utils.localizedText('Found_Errors.customer', err.message));
      if (result) return HttpUtil.unprocessable(res, Utils.localizedText('Unique.customer.code', params.code));
    }

    let dataUnset = {};
    if (params.type.toString() === customerTypes.direct.toString()) {
      delete params.flag;
      dataUnset.flag = '';
    }
    [err, result] = await to(this.model.updateOne(object._id, params, dataUnset, req.authUser));
    if (err) return HttpUtil.internalServerError(res, Utils.localizedText('Errors.update', err.message));

    return HttpUtil.success(res, 'Success.update');
  }

  async destroy(req, res) {
    return super.destroy(req, res)
  }

  async deleteMulti(req, res) {
    return super.deleteMulti(req, res)
  }
}

module.exports = new CustomerController()
