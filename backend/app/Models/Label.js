'use strict';

const mongoose = require('mongoose');
const Schema = mongoose.Schema;
const BaseSchema = require('./BaseSchema');

const mTAG = 'Label';
const projection = {delete: 0, __v: 0}
const FIELDS = {
  name: {type: String, index: true},

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
