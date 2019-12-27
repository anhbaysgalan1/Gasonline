'use strict';

const to = require('await-to-js').default;
const BaseController = require('./BaseController');
const Utils = require('../Utils');
const HttpUtil = require('../Utils/http');
const Model = require('../Models/Vehicle');

class VehicleController extends BaseController {
  constructor() {
    super(VehicleController);
    this.model = Model;
    this.requireParams = {
      ...this.requireParams,
      store: [
        'name',
        'licensePlate',
        'driver',
        'capacity',
        'remain'
      ],
      update: [
        'name',
        'licensePlate',
        'driver',
        'capacity'
      ]
    }
    this.validate = {
      unique: [
        {
          key: 'licensePlate',
          error: 'Found_Errors.vehicle',
          message: 'Unique.vehicle.licensePlate'
        }
      ]
    }
  }

  async load(req, res, next, id) {
    return super.load(req, res, next, id)
  }

  async index(req, res) {
    return super.index(req, res);
  }

  detail(req, res) {
    return super.detail(req, res);
  }

  async store(req, res) {
    return super.store(req, res);
  }

  async update(req, res) {
    return super.update(req, res);
  }

  async destroy(req, res) {
    return super.destroy(req, res);
  }

  async deleteMulti(req, res) {
    return super.deleteMulti(req, res)
  }

  async getByDriver(req, res) {
    let authUser = req.authUser;
    let [err, result] = await to(this.model.getOne({driver: authUser._id}));
    if (err) return HttpUtil.internalServerError(res, Utils.localizedText('Found_Errors.vehicle', err.message));

    if (!result) return HttpUtil.unprocessable(res, Utils.localizedText('Not_Founds.Vehicle_Of_Driver', authUser.code));

    return HttpUtil.success(res, result)
  }
}

module.exports = new VehicleController()
