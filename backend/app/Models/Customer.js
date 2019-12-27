/**
 * @description Schema of Customer model.
 * @author Tran Tuan
 */
const mongoose = require('mongoose');
const Schema = mongoose.Schema;
const BaseSchema = require('./BaseSchema');
const {customerTypes} = require('../../config');

const projection = {delete: 0, __v: 0}
const FIELDS = {
  code: {
    type: String,
    unique: true,
    required: true,
    index: true
  },
  name: {
    type: String,
    required: true,
    index: true
  },
  phone: {
    type: String,
    required: false
  },
  paymentTerm: {
    type: String,
    required: true
  },
  address: {
    type: String,
    required: false
  },
  type: {
    type: Number,
    default: customerTypes.direct
  },
  extraPrice: {
    type: Number,
    required: false,
    default: 0
  },
  flag: {
    type: String,
    required: false,
    default: null
  },
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

let customerSchema = BaseSchema(FIELDS, projection);

module.exports = mongoose.model('Customer', customerSchema);
