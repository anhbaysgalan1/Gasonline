/**
 * @description Schema of Vehicle model.
 * @author Tran Tuan
 */
const mongoose = require('mongoose');
const Schema = mongoose.Schema;
const BaseSchema = require('./BaseSchema');

const projection = {delete: 0, __v: 0}
const FIELDS = {
  name: {
    type: String,
    required: true
  },
  licensePlate: {
    type: String,
    unique: true,
    required: true,
    index: true
  },
  driver: {
    type: Schema.ObjectId,
    ref: 'User'
  },
  capacity: {
    type: Object,
    required: true
  },
  remain: {
    type: Object,
    required: false
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

const arrayJoin = [
  {path: 'driver', select: 'code firstName lastName fullName email driverCards phone'},
]

let vehicleSchema = BaseSchema(FIELDS, projection, null, arrayJoin);

module.exports = mongoose.model('Vehicle', vehicleSchema);
