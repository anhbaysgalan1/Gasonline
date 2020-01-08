'use strict';

const to = require('await-to-js').default;
const DateUtil = require('../Utils/date');
const HttpUtil = require('../Utils/http');
const Utils = require('../Utils');
const BaseController = require('./BaseController');
const Model = require('../Models/History');
const Service = require('../Services/histories');
const {typePouring} = require('../../config');

/*
  Xem hàm mẫu BaseController nếu muốn viết lại các action
*/
class HistoryController extends BaseController {
  constructor() {
    super(HistoryController)
    this.model = Model;
    this.service = Service;
    this.requireParams = {
      ...this.requireParams,
      store: [
        {name: 'type', dataType: "number"},
        {name: 'details', dataType: "array"},
      ],
      update: [
        {name: 'type', dataType: "number"},
        {name: 'details', dataType: "array"},
      ]
    }
    // this.validate = {
    //   unique: [
    //     {
    //       key: 'code',
    //       error: 'Found_Errors.area',
    //       message: 'Unique.area.code'
    //     }
    //   ]
    // }
  }

  async load(req, res, next, id) {
    return super.load(req, res, next, id)
  }

  async index(req, res) {
    let {authUser, query} = req;
    let err, lists, vehicle;
    [err, vehicle] = await to(this.service.getVehicleForDriver(authUser));
    if (err) return HttpUtil.unprocessable(res, err);

    let {date, type} = query;
    let conditions = {
      'insert.when': {
        $gte: DateUtil.getStartOfDate(date),
        $lte: DateUtil.getEndOftDate(date)
      },
      driver: authUser._id,
      vehicle: vehicle._id,
      type: type || typePouring.import
    };

    [err, lists] = await to(this.model.findByCondition(conditions, true));
    if (err) return HttpUtil.internalServerError(res, Utils.localizedText('Load_Lists_Errors.history', err.message));

    return HttpUtil.success(res, lists);
  }

  detail(req, res) {
    return super.detail(req, res)
  }

  async store(req, res) {
    let params = HttpUtil.getRequiredParamsFromJson2(req, this.requireParams.store);
    if (params.error) return HttpUtil.badRequest(res, params.error);

    let authUser = req.authUser;
    let err, result, vehicle;
    [err, vehicle] = await to(this.service.getVehicleForDriver(authUser));
    if (err) return HttpUtil.unprocessable(res, err);

    if (params.type === typePouring.import) {
      params = { ...params, driver: authUser._id, vehicle: vehicle._id };
      let remains = {}, oldRemain = vehicle.remain, capacity = vehicle.capacity;
      params.details.map(item => {
        let { material, quantity } = item;
        let capacityRemain = capacity[material] - oldRemain[material]
        if (capacityRemain < quantity && capacity[material] != undefined) {
          return err = 'Errors.ImportOverCapacity'
        }
        remains[material] = this.service.changeNumberRemainingFuels(oldRemain, material, quantity);
      });
      if (err) return HttpUtil.badRequest(res, Utils.localizedText(err));

      [err, result] = await to(Promise.all([
        this.model.insertOne(params, authUser),
        this.service.updateRemainingFuelsForVehicle(vehicle, remains, authUser)
      ]));

      if (err) return HttpUtil.internalServerError(res, Utils.localizedText('Errors.Import_Fuels', err.message));
      return HttpUtil.success(res, result)
    }

    return this.exportFuels(res, params, authUser, vehicle)
  }

  async exportFuels(res, params, authUser, vehicle) {
    params = HttpUtil.checkRequiredParams2(params, ['orderId']);
    if (params.error) return HttpUtil.badRequest(res, params.error);

    let err, result, order;
    [err, order] = await to(this.service.getOrderForExport(params.orderId));
    if (err) return HttpUtil.unprocessable(res, err);

    let remainingFuels;
    [err, remainingFuels] = this.service.validateExportFuelDetails(vehicle, params.details);
    if (err) return HttpUtil.unprocessable(res, err);

    let obj = {
      customer: order.customer._id,
      details: params.details.map(item => this.service.formatExportDetail(item, order.customer)),
      driver: authUser._id,
      order: order._id,
      vehicle: vehicle._id,
      type: params.type
    };
    [err, result] = await to(Promise.all([
      this.model.insertOne(obj, authUser),
      this.service.updateRemainingFuelsForVehicle(vehicle, remainingFuels, authUser)
    ]));
    if (err) return HttpUtil.internalServerError(res, Utils.localizedText('Errors.Export_Fuels', err.message));

    return HttpUtil.success(res, result);
  }

  async update(req, res) {
    return super.update(req, res);
  }

  async destroy(req, res) {
    return super.destroy(req, res)
  }

  async deleteMulti(req, res) {
    return super.deleteMulti(req, res)
  }

  async fakeData(req, res) {
    let [err, result] = await to(this.service.fakeDataHistories(req.authUser));
    if (err) return HttpUtil.unprocessable(res, err);
    return HttpUtil.success(res, result);
  }
}

module.exports = new HistoryController()
