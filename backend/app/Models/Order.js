/**
 * @description Schema of Order model.
 */
const mongoose = require('mongoose');
const Schema = mongoose.Schema;
const BaseSchema = require('./BaseSchema');
const {statusOrder} = require('../../config')

const projection = {delete: 0, __v: 0}
const FIELDS = {
  code: {
    type: String,
    unique: true,
    required: true,
    index: true
  },
  customer: {
    type: Schema.ObjectId,
    required: true,
    ref: 'Customer'
  },
  area: {
    type: Schema.ObjectId,
    required: true,
    ref: 'Area'
  },
  deliveryAddress: {
    type: String,
    required: true
  },
  mapAddress: {
    latitude: {type: String},
    longitude: {type: String},
  },
  deliveryDate: {
    type: Date,
    required: true
  },
  // deliveryTime options { 1: AM, 2: PM, 3: Anytime }
  deliveryTime: {
    type: Number,
    default: 3
  },
  driver: {
    type: Schema.ObjectId, ref: 'User'
  },
  status: {
    type: Number,
    default: statusOrder.waiting // status { 1: waiting, 2: divided, 3: delivered
  },
  orderDetails: [], // {name: '', quantity: ''}
  insert: {
    when: {type: Date, default: Date.now},
    by: {type: Schema.ObjectId, ref: 'User'}
  },
  update: {
    when: {type: Date},
    by: {type: Schema.ObjectId, ref: 'User'}
  },
  delete: {
    when: {type: Date},
    by: {type: Schema.ObjectId, ref: 'User'}
  }
}

const arrayJoin = [
  {path: 'customer', select: 'code name type extraPrice flag'},
  {path: 'area', select: 'code name'},
  {path: 'driver', select: 'code fullName firstName lastName email'}
]

let orderSchema = BaseSchema(FIELDS, projection, null, arrayJoin);

module.exports = mongoose.model('Order', orderSchema);
