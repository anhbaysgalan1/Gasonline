'use strict';

const mongoose = require('mongoose');
const Schema = mongoose.Schema;
const BaseSchema = require('./BaseSchema');

const mTAG = 'OrderDivide';
const projection = {delete: 0, __v: 0}
const FIELDS = {
  // YYYY-MM-DD
  date: {type: Date, index: true},
  driver: {type: Schema.ObjectId, ref: 'User'},
  ids: [],

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

var tempSchema = BaseSchema(FIELDS, projection);

module.exports = mongoose.model(mTAG, tempSchema);
