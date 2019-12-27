'use strict';

const _ = require('lodash');
const to = require('await-to-js').default;

const FileUtil = require('../Utils/files');
const HttpUtil = require('../Utils/http');
const Utils = require('../Utils');

const config = require('../../config');
let settings = require('../../config/setting.json');
const serverIp = require('ip').address();
const SettingFile = 'setting.json';

let SettingController = {

  async getSettings(req, res) {
    let json = {...settings, serverIp};
    return HttpUtil.success(res, json);
  },

  async update(req, res) {
    let requireParams = [
      'language',
      {name: 'roles', dataType: 'array'}
    ];
    let params = HttpUtil.getRequiredParamsFromJson2(req, requireParams);
    if (params.error) return HttpUtil.badRequest(res, params.error);

    params = Utils.getAcceptableFields(params, requireParams);
    settings = _.extend(settings, params);
    settings.lastUpdated = Date.now();

    let [err, result] = await to(FileUtil.writeFile(SettingFile, config.configDir, settings));
    if (err) return HttpUtil.internalServerError(res, Utils.localizedText('Errors.settings.update', err.message));

    return HttpUtil.success(res, {...settings, serverIp}, "Success.settings.update");
  },

  async getSettingPrice(req, res) {
    let {insurance, taxes, products, prices} = settings;
    let json = {insurance, taxes, products, prices};
    return HttpUtil.success(res, json);
  },

  async updatePrice(req, res) {
    let requireParams = [
      {name: 'insurance', dataType: 'number'},
      {name: 'taxes', dataType: 'object'},
      {name: 'prices', dataType: 'object'}
    ];
    let params = HttpUtil.getRequiredParamsFromJson2(req, requireParams);
    if (params.error) return HttpUtil.badRequest(res, params.error);

    params = Utils.getAcceptableFields(params, requireParams);
    settings = _.extend(settings, params);
    settings.lastUpdated = Date.now();

    let [err, result] = await to(FileUtil.writeFile(SettingFile, config.configDir, settings));
    if (err) return HttpUtil.internalServerError(res, Utils.localizedText('Errors.settings.updatePrice', err.message));

    let {insurance, taxes, products, prices} = settings;
    result = {insurance, taxes, products, prices};

    return HttpUtil.success(res, result, "Success.settings.updatePrice");
  }
}

module.exports = SettingController;
