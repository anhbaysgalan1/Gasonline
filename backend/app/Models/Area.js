/**
 * @description Schema of Area model.
 */
const mongoose = require('mongoose');
const Schema = mongoose.Schema;
const BaseSchema = require('./BaseSchema');

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
  insert: {
    when: { type: Date, default: Date.now },
    by: { type: Schema.ObjectId, ref: 'User' }
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

let areaSchema = BaseSchema(FIELDS, projection);

module.exports = mongoose.model('Area', areaSchema);
