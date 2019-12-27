const to = require('await-to-js').default;
const config = require('../../../config');
const Utils = require('../index');
const Pagination = require('./pagination');

// Nhiều lúc mongoskin bị lỗi hoặc ko đáp ứng được thì chuyển qua dùng mongodb native
const MongoClient = require('mongodb').MongoClient;

////////////// INIT DATABASE CONNECTION ////////////
let mongo = require("mongoose");
const dbConnectURI = config.mongodb.dbConnectURI;
const dbConnectOptions = config.mongodb.options;
const dbMongo = mongo.connect(dbConnectURI);
const TAG = 'DBUtils';

module.exports = {
  mongo: dbMongo,

  lookupHeadRoomForUser(localField = '$_id', asField = 'headRooms') {
    return {
      from: 'room',
      let: {userId: localField},
      pipeline: [{
        $match: {
          $expr: {$eq: ['$ownerId', '$$userId']},
          $or: [{delete: {$exists: false}}, {delete: null}]
        }
      }],
      as: asField
    }
  },

  lookupHeadPartForUser(localField = '$_id', asField = 'headParts') {
    return {
      from: 'part',
      let: {userId: localField},
      pipeline: [{
        $match: {
          $expr: {$eq: ['$ownerId', '$$userId']},
          $or: [{delete: {$exists: false}}, {delete: null}]
        }
      }],
      as: asField
    }
  },

  lookupRoomAdminForUser(localField = '$_id', asField = 'adminRooms') {
    return {
      from: 'room',
      let: {userId: localField},
      pipeline: [{
        $match: {
          $expr: {$eq: ['$adminUserId', '$$userId']},
          $or: [{delete: {$exists: false}}, {delete: null}]
        }
      }],
      as: asField
    }
  },

  // dùng để lookup cho các trường insert, update, delete (trước dùng email, giờ dùng _id)
  lookupUserByIdOrEmail(localField = null, asField = 'user') {
    if (!localField) {
      localField = '$userId'
    }
    return {
      from: 'users',
      let: {idOrEmail: localField},
      pipeline: [{
        $match: {
          $or: [
            {$expr: {$eq: ['$_id', '$$idOrEmail']}},
            {$expr: {$eq: ['$email', '$$idOrEmail']}}
          ]
        }
      }],
      as: asField
    };
  },

  lookupWithUser(localField = null, foreignField = null, asField = 'user') {
    if (!localField) {
      localField = '$userId'
    }
    if (!foreignField) {
      foreignField = '$_id'
    }
    return {
      from: "users",
      let: {userId: localField},
      pipeline: [{
        $match: {
          $expr: {$eq: [foreignField, '$$userId']},
          $or: [{delete: {$exists: false}}, {delete: null}]
        }
      }],
      as: asField
    };
  },

  lookupRoomForUser(localField, asField = null) {
    if (!asField) {
      asField = localField.replace('$', '');
    }
    return {
      from: "room",
      let: {roomId: localField},
      pipeline: [{$match: {$expr: {$eq: ['$_id', '$$roomId']}, $or: [{delete: {$exists: false}}, {delete: null}]}}],
      as: asField
    };
  },

  // Chú ý:
  // part ko lưu trực tiếp trong bảng user, mà phụ thuộc vào room
  // nên phải lookup room trước, rồi mới lookup part theo room.partId
  lookupPartForUser(localField, asField = null) {
    if (!asField) {
      asField = 'user.baseInfo.part';
    }
    return {
      from: 'part',
      let: {partId: localField},
      pipeline: [{$match: {$expr: {$eq: ['$_id', '$$partId']}, $or: [{delete: {$exists: false}}, {delete: null}]}}],
      as: asField
    };
  },

  lookupPositionForUser(localField, asField = null) {
    if (!asField) {
      asField = 'user.baseInfo.position';
    }
    return {
      from: 'position',
      let: {positionId: localField},
      pipeline: [{$match: {$expr: {$eq: ['$_id', '$$positionId']}, $or: [{delete: {$exists: false}}, {delete: null}]}}],
      as: asField
    }
  },

  lookupRolesForUser(localField = 'roles', asField = 'roles') {
    return {
      from: 'roles',
      localField: localField,
      foreignField: '_id',
      as: asField
    }
  },

  lookupProfileForUser(localField = '_id', asField = 'profile') {
    return {
      from: 'profile',
      localField: localField,
      foreignField: 'ownerId',
      as: asField
    }
  },

  getNativeDb() {
    return new Promise((resolve, reject) => {
      MongoClient.connect(dbConnectURI, dbConnectOptions, (err, db) => {
        if (err) reject(err); else resolve(db);
      });
    });
  },

  getNativeCollection(name) {
    return new Promise((resolve, reject) => {
      MongoClient.connect(dbConnectURI, dbConnectOptions, (err, db) => {
        if (err) reject(err); else resolve(db.collection(name));
      });
    });
  },

  // Thêm điều kiện để bỏ ra những bản ghi đã bị xóa mềm rồi
  adjustQuery_ExcludeSoftDelete(query) {
    if (typeof query !== 'object') {
      console.error(TAG + '[adjustQuery] invalid query, expect object but it is ' + typeof query);
      query = undefined;
    }
    var tmp = undefined;
    if (query && Object.keys(query).length == 0) {
      query = undefined;
    }
    if (!query) {
      query = {'$and': []};
    }
    if (!query['$and']) {
      tmp = query;
      query = {'$and': []};
      query['$and'].push(tmp);
    }
    query['$and'].push({
      '$or': [
        {'delete': {'$exists': false}},
        {'delete': null}
      ]
    });
    return query;
  },

  adjustQuery_GetSoftDelete(query) {
    if (typeof query !== 'object') {
      console.error(TAG + '[adjustQuery] invalid query, expect object but it is ' + typeof query);
      query = undefined;
    }
    var tmp = undefined;
    if (query && Object.keys(query).length == 0) {
      query = undefined;
    }
    if (!query) {
      query = {'$and': []};
    }
    if (!query['$and']) {
      tmp = query;
      query = {'$and': []};
      query['$and'].push(tmp);
    }
    query['$and'].push({'delete': {'$exists': true}});
    return query;
  },

  // andArray: để tạo điều kiện truy vấn, vì là search nên phải tạo điều kiện and (VD query = { $and: [ {original conditions}, {search conditions} ] }).
  //           andArray phải là 1 mảng được tạo trước khi đưa vào hàm này, mảng rỗng cũng được, mục đích là để push thêm điều kiện search vào mảng này.
  // fieldsCanSearch: 1 mảng khai báo tên của tất cả những trường trong database có thể search (VD [ 'email', 'name' ]).
  // params: input params lấy từ API.
  // params.search: 1 string mà user gõ vào ô search box, nếu có dấu cách thì sẽ được tách thành mảng các word, và logic search sẽ là điều kiện or của mảng các word đấy.
  //
  // return: trả về mảng các word vừa tách được từ params.search, sẽ trả về cho client để bôi màu kết quả search.
  createSearchConditions: function (andArray, fieldsCanSearch, params) {
    let search = null;
    if (Utils.isString(params)) {
      search = params;
    } else if (params) {
      search = params.search;
    }
    if (!search) {
      return null;
    }
    const s = Utils.adjustSpaces(search);
    const arr = Utils.uniqElementsArray(s.split(' '));
    let val;
    if (arr.length > 1) {
      val = {'$in': []};
      for (var i = 0; i < arr.length; i++) {
        val.$in.push(new RegExp(arr[i], 'i'));
      }
    } else {
      val = new RegExp(arr[0], 'i');
    }
    let condition = {'$or': []};
    for (const field of fieldsCanSearch) {
      let f = {};
      f[field] = val;
      condition.$or.push(f);
    }
    andArray.push(condition);
    return arr;
  },

  // limit = -1 thì sẽ ko phân trang mà lấy hết
  // Mảng aggregateArray phải được tạo trước và truyền vào,
  // trừ trường hợp ko cần điều kiện truy vấn gì thì mới ko cần khởi tạo aggregateArray
  getListPagination: async function (dbCollection, skip, limit, sort, aggregateArray) {
    if (!aggregateArray) {
      aggregateArray = [];
    }

    // Đếm tổng tất cả các bản ghi
    var aggregateArrayForCount = aggregateArray.slice(0);   // duplicate an array
    aggregateArrayForCount.push({$count: 'total'});
    var p1 = new Promise(function (resolve, reject) {
      dbCollection.aggregate(aggregateArrayForCount, function (err, list) {
        if (err) {
          reject(err);
        } else {
          let total = list && list.length > 0 ? list[0].total : 0;
          resolve(total);
        }
      });
    });

    // console.log('[getListPagination] aggregateArray: ', JSON.stringify(aggregateArray, null, 2));

    // Lấy về các bản ghi theo skip, limit
    aggregateArray.push({$sort: sort});
    if (limit >= 0) {
      aggregateArray.push({$skip: Number(skip)});
      aggregateArray.push({$limit: Number(limit)});
    }

    var p2 = new Promise(function (resolve, reject) {
      dbCollection.aggregate(aggregateArray, {collation: {locale: 'vi'}}, function (err, list) {
        if (err) {
          reject(err);
        } else {
          resolve(list);
        }
      });
    });

    // Chạy cả 2 truy vấn đồng thời
    return new Promise((resolve, reject) => {
      (async () => {
        let arr = [p2];
        if (limit >= 0) {
          arr.push(p1);
        }
        let err, result;
        [err, result] = await to(Promise.all(arr));
        if (err) return reject(err);
        let data = Pagination.paginationResult(skip, limit, result[0], result[1]);
        resolve(data);
      })();
    });
  },

  // Xóa cứng nhiều bản ghi
  // condition: điều kiện xóa
  // collectionName: tên collection trong database
  delMany(condition, collectionName) {
    let DBUtils = this;
    return new Promise((resolve, reject) => {
      (async () => {
        let err, collection;
        [err, collection] = await to(DBUtils.getNativeCollection(collectionName));
        if (err) return reject(err);
        // đếm số bản ghi trước
        let count;
        [err, count] = await to(new Promise((success, fail) => {
          collection.count(condition, (e, ret) => {
            if (e) fail(e); else success(ret);
          });
        }));
        if (err) return reject(err);
        // thực hiện xóa
        [err] = await to(new Promise((success, fail) => {
          collection.remove(condition, {justOne: false}, (e) => {
            if (e) fail(e); else success();
          });
        }));
        if (err) return reject(err);
        // trả về số bản ghi đã bị xóa
        resolve(count);
      })();
    });
  }
};
