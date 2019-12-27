'use strict';

const BaseController = require('./BaseController');
const Model = require('../Models/Area');

/*
  Xem hàm mẫu BaseController nếu muốn viết lại các action
*/
class AreaController extends BaseController {
  constructor() {
    super(AreaController)
    this.model = Model;
    this.requireParams = {
      ...this.requireParams,
      store: ['code', 'name'],
      update: ['code', 'name']
    }
    this.validate = {
      unique: [
        {
          key: 'code',
          error: 'Found_Errors.area',
          message: 'Unique.area.code'
        }
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
    return super.store(req, res);
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
}

module.exports = new AreaController()
