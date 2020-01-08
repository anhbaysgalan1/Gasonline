'use strict'

const to = require('await-to-js').default;
const AuthUtil = require('../Utils/auth');
const Utils = require('../Utils');
const HttpUtil = require('../Utils/http');
const BaseController = require('./BaseController');
const User = require('../Models/User');
const {roles} = require('../../config');

class Controller extends BaseController {
  constructor() {
    super(Controller);
    this.model = User;
    this.requireParams = {
      ...this.requireParams,
      store: [
        'email',
        'firstName',
        'lastName',
        'phone',
        'driverCards',
        'password',
        'confirmPassword'
      ],
      update: [
        'email',
        'firstName',
        'lastName',
        'phone',
        'driverCards'
      ]
    }
    this.filters = {role: roles.driver}
    this.validate = {
      unique: [
        {
          key: 'email',
          error: 'Found_Errors.driver',
          message: 'Unique.user.email'
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
    return super.detail(req, res);
  }

  async store(req, res) {
    let params = HttpUtil.getRequiredParamsFromJson2(req, this.requireParams.store);
    if (params.error) return HttpUtil.badRequest(res, params.error);

    params = Utils.getAcceptableFields(params, this.requireParams.store);

    let err, result;
    let condition = {email: params.email};
    [err, result] = await to(this.model.getOne(condition));
    if (err) return HttpUtil.internalServerError(res, Utils.localizedText('Found_Errors.user', err.message));

    if (result) return HttpUtil.unprocessable(res, Utils.localizedText('Unique.user.email', params.email));
    let password = AuthUtil.setPassword(params.password);
    delete params.password;
    delete params.confirmPassword;

    [err, params] = await to(this.setUserCode(params));
    if (err) return HttpUtil.internalServerError(res, err);

    params = {
      ...params,
      ...password
    };
    params = AuthUtil.setFullName(params);
    [err, result] = await to(this.model.insertOne(params));
    if (err) return HttpUtil.internalServerError(res, Utils.localizedText('Errors.create', err.message));
    delete result.__v; // not copy version;

    return HttpUtil.success(res, result, 'Success.create');
  }

  async update(req, res) {
    let object = req.object;
    if (!object) return HttpUtil.badRequest(res, 'Not_Founds.Request_Object')

    let params = HttpUtil.getRequiredParamsFromJson2(req, this.requireParams.update);
    if (params.error) return HttpUtil.badRequest(res, params.error);
    params = Utils.getAcceptableFields(params, this.requireParams.update);

    let err, msg;
    for (let i = 0; i < this.validate.unique.length; i++) {
      let item = this.validate.unique[i];
      if (params[item.key] && object[item.key] && params[item.key] !== object[item.key]) {
        [err, msg] = await to(this.validateUnique(item, params));
        if (err) return HttpUtil.internalServerError(res, err.message)
        if (msg !== true) return HttpUtil.unprocessable(res, msg)
      }
    }

    delete params._id; // not update _id
    // validate value input, validate unique, permission ...
    params = AuthUtil.setFullName(params);
    let result;
    [err, result] = await to(this.model.updateOne(object._id, params, {}, req.authUser));
    if (err) return HttpUtil.internalServerError(res, Utils.localizedText('Errors.update', err.message));

    return HttpUtil.success(res, 'Success.update');
  }

  async destroy(req, res) {
    return super.destroy(req, res)
  }

  async deleteMulti(req, res) {
    return super.deleteMulti(req, res)
  }

  async setUserCode(params = {}) {
    let options = {
      perPage: 1,
      page: 0,
      filters: {...this.filters},
      sorts: {'code': -1}
    }

    let [err, users] = await to(this.model.lists(options));
    if (err) throw Error(err.message);

    let user = users.length ? users[0] : null;
    let code;
    if (!user || !user.code) {
      code = 'USER0001'
    } else {
      code = user.code.replace('USER', '');
      if (Utils.isNumber(parseInt(code))) {
        code = `USER${Utils.zeroLeading(parseInt(code) + 1, 4)}`
      } else {
        code = 'USER0001'
      }
    }
    params.code = code
    return params;
  }
}

module.exports = new Controller()
