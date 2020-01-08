'use strict';

const moment = require('moment');
const to = require('await-to-js').default;
const AuthUtil = require('../Utils/auth');
const DateUtil = require('../Utils/date');
const Utils = require('../Utils');
const Model = require('../Models/Order');
const ModelArea = require('../Models/Area');
const ModelCustomer = require('../Models/Customer');
const ModelOrderDivide = require('../Models/OrderDivide');
const ModelUser = require('../Models/User');
const {formatDate, roles, statusOrder} = require('../../config');

class Services {
  constructor() {
    this.model = Model;
    this.mArea = ModelArea;
    this.mCustomer = ModelCustomer;
    this.mDriver = ModelUser;
    this.mOrderDevide = ModelOrderDivide;
  }

  genDataStore(params) {
    let {customer, area, deliveryDate, deliveryTime, deliveryAddress, orderDetails, lat, lng} = params;
    let mapAddress = {};
    if (lat && lng) {
      mapAddress = {
        latitude: lat,
        longitude: lng,
      }
    }
    return {
      customer,
      area,
      deliveryDate: moment(deliveryDate).format(formatDate),
      deliveryTime,
      deliveryAddress,
      mapAddress,
      orderDetails
    }
  }

  setOrderCode(area, customer) {
    return `${area.code}${customer.code}${AuthUtil.randomValueHex(8).toUpperCase()}`
  }

  async validateRelation(params, field) {
    let ModelRelation = field === 'customer' ? ModelCustomer : ModelArea;
    let [err, exist] = await to(ModelRelation.getOne({_id: params[field]}));
    if (err) throw Error(Utils.localizedText(`Found_Errors.${field}`, err.message));
    if (!exist) throw Error(Utils.localizedText(`Not_Exists.${field}`, params[field]));
    return exist;
  }

  async validateBeforeDivide(params) {
    let err, driver, orders;
    [err, driver] = await to(this.mDriver.getOne({_id: params.driver}));
    if (err) throw Error(Utils.localizedText('Found_Errors.driver', err.message));

    [err, orders] = await to(this.model.findByCondition({_id: {$in: params.ids}}));
    if (err) throw Error(Utils.localizedText('Found_Errors.order', err.message));
    if (orders.length !== params.ids.length) throw Error('Params orders invalid.')

    params.driver = {_id: driver._id, code: driver.code};
    return params;
  }

  async divideOrders(params, authUser) {
    let err, exist, result;
    let {date, driver, ids} = params;
    [err, result] = await to(this.model.updateManyByCondition(
      {_id: {$in: ids}},
      {status: statusOrder.divided, driver: driver._id},
      {},
      authUser
    ));
    if (err) throw Error(Utils.localizedText('Errors.update', err.message))
    return result;
  }

  async sortDivided(params, authUser) {
    let err, exist, result;
    let {date, driver, ids} = params;
    [err, result] = await to(this.model.updateManyByCondition(
      {_id: {$in: ids}},
      {status: statusOrder.divided, driver: driver._id},
      {},
      authUser
    ));
    if (err) throw Error(Utils.localizedText('Errors.update', err.message))
    return result;
  }

  getDeliveryOthers(orders = [], drivers = []) {
    if (!orders.length) return orders;

    let list = {};
    if (!drivers.length) {
      orders.map(order => {
        let item = Utils.cloneObject(order);
        let {driver, ...others} = item;
        if (list[driver._id]) {
          list[driver._id].orders.push(others);
        } else {
          list[driver._id] = {
            id: driver.code,
            driver: driver,
            orders: [others]
          };
        }
      })
      list = Object.values(list)
    }
    return list;
  }

  async fakeDataOrder(date) {
    date = DateUtil.getStartOfDate(date).format('YYYY-MM-DD')
    const obj = {
      deliveryDate: date,
      deliveryTime: '3',
      orderDetails: [
        {name: 'diesel', quantity: '100'},
        {name: 'kerosene', quantity: '100'},
        {name: 'gasoline', quantity: '100'},
        {name: 'adBlue', quantity: '100'}
      ]
    }

    let areas, customers, err, result;
    [err, areas] = await to(this.mArea.findByCondition({}));
    if (err) throw Error(`Load areas failed: ${err.message}`);

    [err, customers] = await to(this.mCustomer.findByCondition({}));
    if (err) throw Error(`Load customers failed: ${err.message}`);

    let data = [];
    customers.map(customer => {
      areas.map(area => {
        data.push({
          code: this.setOrderCode(area, customer),
          customer: customer._id,
          area: area._id,
          deliveryAddress: `Test${Utils.getRandomInt(100)}`,
          ...obj
        })
      })
    });

    [err, result] = await to(this.model.insertMany(data));
    if (err) throw Error(`Fake orders failed: ${err.message}`);
    return result;
  }

  async fakeDataDividedOrder() {
    let err, result;
    [err, result] = await to(Promise.all([
      this.mDriver.findByCondition({role: roles.driver, delete: {$exists: false}}),
      this.model.findByCondition({status: statusOrder.waiting})
    ]));
    if (err) throw Error(`Load data failed: ${err.message}`);

    let drivers = result[0], orders = result[1];
    if (!drivers.length || !orders.length) throw Error(`Drivers length: ${drivers.length}. Orders length: ${orders.length}`)

    let length = drivers.length;
    [err, result] = await to(
      Promise.all(orders.map((order, index) => {
        let key = index < length ? index : (index % length);
        return this.model.updateOne(order._id, {status: statusOrder.divided, driver: drivers[key]._id})
      }))
    );
    if (err) throw Error(`Fake divide orders failed: ${err.message}`);
    return result
  }
}

module.exports = new Services()
