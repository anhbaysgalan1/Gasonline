/**
 * @description Schema of History model.
 */
const mongoose = require('mongoose');
const Schema = mongoose.Schema;
const BaseSchema = require('./BaseSchema');
const { typePouring } = require('../../config');

const projection = { delete: 0, __v: 0 }
const DETAILS = {
  material: {
    type: String,
    required: true,
    index: true
  },
  quantity: {
    type: Number,
    required: true
  },
  price: {
    type: Number,
    required: false
  },
  extraPrice: { // giá cộng thêm tùy mỗi khách hàng
    type: Number,
    required: false
  },
  insurance: { // bảo hiểm ứng với khách hàng của MC
    type: Number,
    required: false
  },
  tax: {
    type: Number,
    required: false
  },
  dieselTax: {
    type: Number,
    required: false
  }
}
// example for details
// except field:
//    import: material, quantity
//    export: material, quantity, price, extraPrice, insurance, tax, dieselTax
// [
//    {
//      material: 'xxx', quantity: 100,
//      price: 100, extraPrice: 3, insurance: 30, tax: 10, dieselTax: 10
//    }
// ]

const FIELDS = {
  driver: {
    type: Schema.ObjectId,
    required: true,
    ref: 'User',
    index: true
  },
  vehicle: {
    type: Schema.ObjectId,
    required: true,
    ref: 'Vehicle',
    index: true
  },
  order: {
    type: Schema.ObjectId,
    required: false,
    ref: 'Order'
  },
  customer: {
    type: Schema.ObjectId,
    required: false,
    ref: 'Customer'
  },
  type: {
    type: Number,
    required: true,
    default: typePouring.import,
    index: true
  },
  details: {
    type: Array,
    required: true
  },
  receivedVehicle: {
    type: String,
    required: false
  },
  insert: {
    when: { type: Date, default: Date.now },
    by: { type: Schema.ObjectId, ref: 'User' }
  },
  update: {
    when: { type: Date },
    by: { type: Schema.ObjectId, ref: 'User' }
  },
  delete: {
    when: { type: Date },
    by: { type: Schema.ObjectId, ref: 'User' }
  }
}
const arrayJoin = [
  { path: 'order', select: 'code area deliveryAddress deliveryDate orderDetails status deliveryTime' },
  { path: 'customer', select: 'code name' },
  { path: 'driver', select: 'code fullName firstName lastName email' },
  { path: 'vehicle', select: 'name licensePlate driver' }
]

let historySchema = BaseSchema(FIELDS, projection, null, arrayJoin);
historySchema.statics.getInvoiceByCustomer = async function ({ fromDate, toDate, customerId, groupBy = "order" }) {
  let aggregate = []
  //filter theo khách hàng
  if (customerId) {
    aggregate = [
      { $match: { customer: mongoose.Types.ObjectId(customerId) } },
    ]
  }

  aggregate = [
    ...aggregate,
    { //query lọc ngày
      $match: {
        "insert.when": {
          $gte: fromDate,
          $lte: toDate
        },
        type: typePouring.export,
      }
    },
    {
      $unwind: "$details"
    },
    { //group theo khách hàng, order, nguyên liệu, thuế....
      $group: {
        _id: {
          groupId: groupBy == "car" ? "$vehicle" : "$order",
          material: "$details.material",
          tax: "$details.tax",
          dieselTax: "$details.dieselTax",
        },
        driver: { $first: "$driver" },
        vehicle: { $first: "$vehicle" },
        customer: { $first: "$customer" },
        order: { $first: "$order" },
        material: { $first: "$details.material" },
        price: { $first: "$details.price" },
        tax: { $first: "$details.tax" },
        dieselTax: { $first: "$details.dieselTax" },
        extraPrice: { $first: "$details.extraPrice" },
        quantity: { $sum: "$details.quantity" }, //tổng số lượng
        date: { $first: "$insert.when" }
      }
    },
    {
      $sort: {
        'material': 1,
        'date': 1
      }
    },
    {
      $lookup: {
        from: 'orders',
        localField: 'order',
        foreignField: '_id',
        as: 'order'
      }
    },
    {
      $unwind: {
        path: "$order",
        preserveNullAndEmptyArrays: true
      }
    },
    {
      $lookup: {
        from: 'customers',
        localField: 'customer',
        foreignField: '_id',
        as: 'customer'
      }
    },
    {
      $unwind: {
        path: "$customer",
        preserveNullAndEmptyArrays: true
      }
    }
  ];
  if (groupBy == "car") {
    aggregate = [
      ...aggregate,
      {
        $lookup: {
          from: 'vehicles',
          localField: 'vehicle',
          foreignField: '_id',
          as: 'vehicle'
        }
      },
      {
        $unwind: {
          path: "$vehicle",
          preserveNullAndEmptyArrays: true
        }
      },
    ]
  }
  let result = await this.aggregate(aggregate).exec();
  return result;
}
module.exports = mongoose.model('History', historySchema);
