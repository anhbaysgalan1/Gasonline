'use strict';

const to = require('await-to-js').default;
const DateUtil = require('../Utils/date');
const HttpUtil = require('../Utils/http');
const Utils = require('../Utils');
const BaseController = require('./BaseController');
const Model = require('../Models/Order');
const ModelOrderDivide = require('../Models/OrderDivide');
const Services = require('../Services/orders');

class DeliveryController extends BaseController {
  constructor() {
    super(DeliveryController);
    this.model = Model;
    this.mOrderDevide = ModelOrderDivide;
    this.service = Services;
  }

  // lấy danh sách giao hàng theo ngày
  async getForMe(req, res) {
    let {authUser, query} = req;
    let {date} = query;
    let conditions = {
      deliveryDate: {
        $gte: DateUtil.getStartOfDate(date),
        $lte: DateUtil.getEndOftDate(date)
      },
      driver: authUser._id
    }

    let [err, lists] = await to(this.model.findByCondition(conditions, true));
    if (err) return HttpUtil.internalServerError(res, Utils.localizedText('Load_Lists_Errors.delivery', err.message));

    return HttpUtil.success(res, lists);
  }

  async getForOthers(req, res) {
    let {authUser, query} = req;
    let {date} = query;
    let conditions = {
      deliveryDate: {
        $gte: DateUtil.getStartOfDate(date),
        $lte: DateUtil.getEndOftDate(date)
      },
      driver: {$exists: true, $ne: authUser._id}
    }

    let [err, lists] = await to(this.model.findByCondition(conditions, true));
    if (err) return HttpUtil.internalServerError(res, Utils.localizedText('Load_Lists_Errors.Delivery_Others', err.message));
    lists = this.service.getDeliveryOthers(lists, []);

    return HttpUtil.success(res, lists);
  }
}

module.exports = new DeliveryController()
