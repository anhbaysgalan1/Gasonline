/**
 * @description Schema of User model.
 */
'use strict';

const mongoose = require('mongoose');
const BaseSchema = require('./BaseSchema');
const {roles} = require('../../config');
const Utils = require('../Utils');

const mTAG = 'User'
const projection = {delete: 0, __v: 0, hash: 0, salt: 0}
const FIELDS = {
  code: {
    type: String,
    required: true,
    unique: true,
    index: true
  },
  email: {
    type: String,
    required: true,
    unique: true,
    index: true
  },
  firstName: {
    type: String,
    required: true,
    index: true
  },
  lastName: {
    type: String,
    required: true,
    index: true
  },
  fullName: {
    type: String,
    required: true,
    index: true
  },
  role: {
    type: String,
    required: true,
    default: roles.driver
  },
  phone: String,
  driverCards: {
    fuelNumber: String,
    deliverNumber: String
  },
  hash: {
    type: String,
    required: true
  },
  salt: {
    type: String,
    required: true
  },
  insert: {
    when: {type: Date, default: Date.now}
  },
  update: {
    when: {type: Date}
  },
  delete: {
    when: {type: Date}
  }
}

const allowField = ['_id', 'code', 'email', 'fullName', 'firstName', 'lastName', 'role', 'phone', 'driverCards', 'insert', 'update'];
const methods = {
  getFields: function (fields = allowField) {
    return Utils.fillOptionalFields(this, {}, fields);
  }
}

let userSchema = BaseSchema(FIELDS, projection, methods);

module.exports = mongoose.model(mTAG, userSchema);
