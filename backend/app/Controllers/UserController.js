'use strict'

const to = require('await-to-js').default;
const AuthUtil = require('../Utils/auth');
const Utils = require('../Utils');
const HttpUtil = require('../Utils/http');
const BaseController = require('./BaseController');
const User = require('../Models/User');
const {roles} = require('../../config');

class UserController extends BaseController {
  constructor() {
    super(UserController);
    this.model = User;
    this.requireParams = {
      ...this.requireParams,
      store: [
        'email',
        'firstName',
        'lastName',
        'phone',
        'password',
        'confirmPassword'
      ],
      update: [
        'email',
        'firstName',
        'lastName',
        'phone'
      ]
    }
    this.filters = {role: roles.admin}
    this.validate = {
      unique: [
        {
          key: 'email',
          error: 'Found_Errors.user',
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

    if (!Utils.compareString(params.password, params.confirmPassword)) {
      return HttpUtil.badRequest(res, "Errors.Pw_Not_Match");
    }

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
      ...password,
      role: roles.admin
    };

    [err, result] = await to(this.model.insertOne(params));
    if (err) return HttpUtil.internalServerError(res, Utils.localizedText('Errors.create', err.message));
    delete result.__v; // not copy version;

    return HttpUtil.success(res, result, 'Success.create');
  }

  async update(req, res) {
    return super.update(req, res)
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
      code = 'AD001'
    } else {
      code = user.code.replace('AD', '');
      if (Utils.isNumber(parseInt(code))) {
        code = `AD${Utils.zeroLeading(parseInt(code) + 1, 3)}`
      } else {
        code = 'AD001'
      }
    }
    params.code = code
    return params;
  }
}

module.exports = new UserController()
