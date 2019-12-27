const debug = use("debug")("mqmodel:lookupR")
const ObjectId = use("./ObjectId")
const _ = use("lodash")
const moment = use('moment')
RegExp.prototype.toJSON = RegExp.prototype.toString

class LookupR {
  constructor(model, aggregation) {
    this.Model = model.constructor
    this.Aggregation = aggregation
    this.conditionByModels = {}
  }

  /**
   * hàm public dùng để tạo aggregation tự động
   * @param {object} fields các field sẽ lấy ra
   */
  lookupR(fields) {
    const operators = this.getOperators(fields)
    let matchOperator = operators.filter(operator => operator["$match"] != undefined)[0]
    let con = {}
    if (matchOperator) this.makeConditionByModels(matchOperator.$match, fields)

    let rootCondition = this.getConditionByModelName(this.Model.name)
    //gán tạm _id sang @id vì trong hàm đệ quy có su dụng group, có thể sẽ bị chèn mất trường _id gốc
    this.Aggregation.push([{
        $addFields: {
          "@id": "$_id"
        }
      }
    ])

    //thêm các điều kiện $match ở model gốc. để match trước khi join
    if(rootCondition){
      this.Aggregation.push(rootCondition)
    }

    this._lookupRecursive(fields, Object.assign({}, fields), this.Model)
    //xử lý các condition không thể detect theo từng model
    if (Object.keys(this.conditionByModels).length) {
      let finalConditions = {}
      for(let model in this.conditionByModels){
        let conditions = this.conditionByModels[model]
        for(let condition of conditions){
          finalConditions = {
            ...finalConditions,
            [condition.field]: condition.condition
          }
        }
      }
      this.Aggregation.push({
        $match: finalConditions
      })
    }
    //chỉ lấy các fields đã chọn
    this.Aggregation.push({
      $project: fields
    })

    return this.Aggregation
  }

  /**
   *
   * @param {*} fields
   * @param {*} rootFields
   * @param {*} matchByModels
   * @param {*} model
   * return về giá trị có xử lý đệ quy nữa hay không.
   */
  _lookupRecursive(fields, rootFields, model, prefix = "") {
    let fieldsName = Object.keys(fields)
    let hasRecursive = false
    for (let fieldName of fieldsName) {
      //nếu giá trị của fields là object tức là model con, kiểm tra quan hệ vè đề quy
      if (typeof fields[fieldName] == "object" || model.relationship[fieldName]) {
        let subModelName = fields[fieldName].$from || fieldName
        let info = model.relationship[subModelName]
        if (!info) {
          console.error(subModelName + ": not found in relationships")
        } else {
          hasRecursive = true //đánh dấu là có object cần lookup.
          try {
            //khởi tạo quen hệ
            let localField, foreignField, conditionJoin
            let subModel = use(info.model)
            let asName = `${prefix}${fieldName}`.replace(/\./g, "@") //lấy name theo as hoặc fieldName
            //nếu subModel truyền vào project không phải là object hoặc không có thông tin trường, thì tự động push tất cả field của subModel vào project
            if (typeof fields[fieldName] != "object" || (fields[fieldName].$from && Object.keys(fields[fieldName]).length == 1)) {
              let subSchema = subModel.schema()
              fields[fieldName] = {}
              for (let sfield in subSchema) {
                if (subSchema[sfield] != "function") { //loại bỏ các quan hệ khác của sub models
                  fields[fieldName][sfield] = 1
                }
              }
            }

            let operators = this.getOperators(fields[fieldName], subModel) //lấy các operator của sub model
            if(operators.$match) this.makeConditionByModel(operators.$match)

            localField = `${prefix}`.replace(/\.(?=.*\.)/g, "@") + `${info.localField}`
            foreignField = info.foreignField
            //lưu ý conditionJoin không sử dụng 2 biên bên trên, vì conditionJoin là nội bộ 2 collection.
            //2 biến trên dùng để sử dụng global trong aggregation
            conditionJoin = this.getConditionToJoin(model, info.localField, subModel, info.foreignField)

            debug("lookup relationships: ", JSON.stringify(fieldName, null, 2))
            debug("fields: ", JSON.stringify(fields[fieldName], null, 2))
            debug("conditions: ", conditionJoin)
            debug("operators: ", JSON.stringify(operators, null, 2))
            debug("----")
            //lookup các model con, sau đó unwind luôn, mục đích unwind là để tiếp tục đệ quy lookup các model nhỏ hơn nữa.
            let customLookup = info.$lookup || null

            let $matchAfterJoin = this.getConditionByModelName(subModel.name)

            this.Aggregation.push([
              //nếu có custom lookup thì ưu tiên sử dụng custom (tham số thứ 4 trong khai báo model)
              {
                $lookup: customLookup ? customLookup : {
                  from: subModel.collectionName,
                  let: {
                    localField: `$${localField}`
                  },
                  pipeline: [{
                      $match: {
                        $expr: conditionJoin,
                      },
                    },
                    ...operators
                  ],
                  as: asName
                }
              },
              {
                $unwind: {
                  path: `$${asName}`,
                  preserveNullAndEmptyArrays: true
                }
              }
            ])

            if($matchAfterJoin){
              this.Aggregation.push($matchAfterJoin)
            }
            //thêm object tạm vừa lưu giá trị của model con vào fields để lưu trữ.
            let newRootFields = {
              ...rootFields,
              [asName]: Object.assign({}, fields[fieldName])

            }
            //đệ quy vào phía trong
            let hasSubRecursive = this._lookupRecursive(fields[fieldName], newRootFields, subModel, `${prefix}${fieldName}.`)
            //bỏ unwind (group lại) sau khi đã lấy xong các phần tử con
            this.groupIfNeed(fields[fieldName], rootFields, asName, prefix, info.relationType, hasSubRecursive)
          } catch (e) {
            console.log(e)
            console.error(`${info.model} is not model`)
          }
        }
      }
    }
    return hasRecursive
  }

  /** Các hàm liên quan đến conditions */
  /**
   * Lấy condition theo từng Model, sử dụng để lấy condition sau khi join collection
   * @param {string} modelName tên model
   */
  getConditionByModelName(modelName) {
    let conditions = this.conditionByModels[modelName] || undefined
    delete this.conditionByModels[modelName] //xóa bỏ luôn condition của model đó trong object tổng.
    //đổi tên các field trong condition: user.group.id thành user@group.id
    if (conditions) {
      let replacedConditions = {}
      for (let condition of conditions) {
        let conditionField = condition.queryField
        let conditionValue = condition.condition
        replacedConditions[conditionField] = conditionValue
      }
      conditions = {
        $match: replacedConditions
      }
    }
    return conditions
  }

  makeConditionByModels(conditions, fields = {}) {
    for (let field in conditions) {
      let realField = this.getRealField(field, fields)
      const model = _.get(this.Model.getModelByField(realField), "name", "undefined")
      if (!this.conditionByModels[model]) this.conditionByModels[model] = []
      this.conditionByModels[model].push({
        model: model,
        field: field,
        realField: realField,
        queryField: field.replace(/\.(?=.*\.)/g, "@"),
        condition: conditions[field]
      })
    }
    return this.conditionByModels
  }

  /**
   * Tạo ra bộ điều kiện để join 2 trường thuộc 2 table
   * @param {*} model1
   * @param {*} field1
   * @param {*} model2
   * @param {*} field2
   */
  getConditionToJoin(model1, field1, model2, field2) {
    let typeField1 = model1.getTypeofField(field1) //schemaTable1[field1]
    let typeField2 = model2.getTypeofField(field2) //schemaTable2[field2]
    let condition = {
      $eq: [`$${field2}`, `$$localField`]
    }

    if (Array.isArray(typeField1)) {
      condition = {
        $in: [`$${field2}`, {
          $ifNull: ["$$localField", []]
        }]
      }
    } else if (Array.isArray(typeField2)) {
      condition = {
        $in: [`$$localField`, {
          $ifNull: [`$${field2}`, []]
        }]
      }
    }
    return condition
  }

  /** Các hàm liên quan đến group */
  /**
   * Group lại dữ liệu sau khi unwind để lấy các phần tử con.
   * @param {*} fields
   * @param {*} rootFields
   * @param {*} name
   * @param {*} prefix
   * @param {*} relatedType
   */
  groupIfNeed(fields, rootFields, name, prefix = "", relatedType, hasSubRecursive) {
    let relateHasOne = [
      "belongsTo",
      "hasOne",
      "embedsOne",
      "morphOne"
    ]
    if (relateHasOne.includes(relatedType)) {
      //nếu là quan hệ chỉ có 1 bản ghi, thì giữ nguyên, sử dụng addfields mục đích là để nhét các object con vào object cha
      this.Aggregation.push({
        $addFields: {
          [name]: this.buildIdFieldPush(fields, [], `${name}.`)
        }
      })
    } else if (!hasSubRecursive) {
      //nếu có nhiều bản ghi, và không có sub-object, thì xóa bỏ lệnh unwind đã thêm vào trước đó, giảm bớt unwind và group.
      //this.Aggregation.pop()
      let aggregation = this.Aggregation.get()
      let index = -1
      for (let i = aggregation.length - 1; i > 0; i--) {
        if (aggregation[i]["$unwind"]) {
          index = i;
          break;
        }
      }
      this.Aggregation.remove(index, 1)
    } else {
      //trường hợp có nhiều bản ghi, và mỗi bản ghi lại có object con thì trước đó unwind ra để lấy lookup sub-object, bây giờ group lại và
      //push lại các fields, bao gồm cả object con.
      this.Aggregation.push({
        $group: {
          _id: {
            ...(this.buildIdFieldGroup(rootFields, prefix == "" ? [name] : []))
          },
          ...(this.buildIdFieldFirst(rootFields, name, prefix == "" ? [name] : [])),
          [name]: {
            $push: {
              ...this.buildIdFieldPush(fields, [], `${name}.`)
            }
          }
        }
      })
    }

  }

  /**
   * Tạo ra danh sách các fields để add vào trường _id khi group
   * @param {*} fields
   * @param {*} except
   */
  buildIdFieldGroup(fields, except = []) {
    let fieldsName = Object.keys(fields)
    let result = {}
    for (let field of fieldsName) {
      if (except.includes(field)) continue
      if (field == "_id") {
        result[field] = '$@id'
      } else if (typeof fields[field] == "object") {
        result[field] = `$${field}`.replace(/\./g, "@")
      } else {
        result[field] = `$${field}`.replace(/\.(?=.*\.)/g, "@")
      }

    }
    return result
  }

  /**
   * Tạo ra danh sách các fields để push vào object con khi group
   * @param {object} fields danh sách các trường sẽ push vào
   * @param {array} except: các trường sẽ loại bỏ khi push
   * @param {string} prefix: tiền tố của các trường.
   */
  buildIdFieldPush(fields, except = [], prefix = "") {
    let fieldsName = Object.keys(fields)
    let result = {}
    for (let field of fieldsName) {
      if (except.includes(field)) continue
      if (typeof fields[field] == "object") {
        result[field] = `$${prefix}${field}`.replace(/\./g, "@")
      } else {
        result[field] = `$${prefix}${field}`.replace(/\.(?=.*\.)/g, "@")
      }

    }
    return result
  }

  /**
   * Danh sách các trường sẽ giữ lại khi group. sử dụng first để giữ lại các trường mong muốn.
   * @param {*} fields
   * @param {*} name
   * @param {*} except
   */
  buildIdFieldFirst(fields, name, except = []) {
    fields = Object.keys(fields)
    let schema = this.Model.schema()
    fields = _.union(fields, Object.keys(schema))
    let result = {}
    for (let field of fields) {
      if (except.includes(field)) continue
      if (field == "_id") {
        result[`@id`] = {
          $first: `$@id`
        }
      } else {
        result[field] = {
          $first: `$${field}`
        }
      }

    }
    return result
  }

  /**
   * lấy fieldname thật sự trong DB để join và query.
   * @param {*} field
   * @param {*} $project
   */
  getRealField(field, $project) {
    let arr = field.split(".")
    let fields = $project
    let result = [];
    for (let name of arr) {
      let realName = name
      //nếu field đang xet là object, và có $from, thì gán $from vào tên thật
      if (typeof fields[name] == "object") {
        if (fields[name].$from) realName = fields[name].$from
        fields = fields[name]
      }
      result.push(realName)
    }
    return result.join(".")
  }
  /**
   * lấy danh sách tất cả các toán tử điều kiện như: sort, skip, limit, match.... đồng thời xóa bỏ các toán tử điều kiện này khỏi danh sách field
   *
   * @param {*} fields
   */
  getOperators(fields, model) {
    if (!model) model = this.Model

    let fieldKeys = Object.keys(fields)
    let operators = []
    for (let key of fieldKeys) {
      if (key == '$match') {
        operators.push({
          $match: this.buildFilters(fields[key], model, fields)
        })
        delete fields[key]
      } else if (key[0] == "$") {
        //loại bỏ trường hợp field là $from // biến đặc biệt khi join
        if (key != "$from") {
          operators.push({
            [key]: fields[key]
          })
        }
        delete fields[key]
      }
    }
    return operators
  }

  /**
   * Tạo ra regex cho filters khi kiểu dữ liệu gửi lên là string
   * @param {*} filters
   */
  buildFilters(filters, model, fields) {
    let filterKeys = Object.keys(filters)
    for (let key of filterKeys) {
      let realField = this.getRealField(key, fields)
      let type = this.Model.getTypeofField(realField, model) || "undefined"
      let valueIsObjectId = false;
      try{
        ObjectId(filters[key])
        valueIsObjectId = true
      }
      catch(e){
        valueIsObjectId = false
      }
      if (key.indexOf("$") === 0) {
        if (Array.isArray(filters[key]) && type == "undefined") {
          filters[key] = filters[key].map(filter => this.buildFilters(filter, model, fields))
        } else {
          filters[key] = this.convertVariableType(filters[key], type)
        }
      } else if (Array.isArray(filters[key])) { //trường hợp là array thì tự động add thêm $in
        filters[key] = {
          $in: this.convertVariableType(filters[key], type)
        }
      } else if (typeof filters[key] == "object" && !moment.isMoment(filters[key]) && !valueIsObjectId) {
        filters[key] = this.convertVariableType(filters[key], type)
      } else if (type == "date") {
        filters[key] = {
          $eq: this.convertVariableType(filters[key], type)
        }
      } else if (type == "objectid") {
        filters[key] = {
          $eq: this.convertVariableType(filters[key], type)
        }

      } else if (type == "number") {
        filters[key] = this.convertVariableType(filters[key], type)
      } else if (type == "boolean") {
        filters[key] = this.convertVariableType(filters[key], type)
      } else if (type == "string") {
        //conditions[filter.id] = new RegExp(this.escapeRegExp(String(filter.value).trim()), 'i') // không phân biệt hoa thường. search LIKE
        filters[key] = new RegExp(this.escapeRegExp(String(filters[key]).trim()), "i")
      }
    }
    return filters
  }

  escapeRegExp(string) {
    return string.replace(/[.*+?^${}()|[\]\\]/g, '\\$&'); // $& means the whole matched string
  }


  //convert object dữ liệu về đúng định dạng của nó. hỗ trợ đệ quy object/array
  convertVariableType(variable, type) {
    if (type == "objectid") {
      return ObjectId(variable)
    } else if (type == "moment" && (moment.isMoment(variable) || typeof variable != "object")) {
      return new Date(variable)
    } else if (type == "number" && typeof variable != "object") {
      return Number(variable)
    } else if (type == "boolean" && typeof variable != "object") {
      let value = typeof variable == "string" ? variable.toLowerCase() : variable
      return [true, "true", "1", 1].includes(value)
    } else if (Array.isArray(variable)) {
      for (let i in variable) {
        variable[i] = this.convertVariableType(variable[i], type)
      }
    } else if (typeof variable == "object") {
      let keys = Object.keys(variable)
      for (let key of keys) {
        if (typeof type == "object" && type[key] !== undefined) {
          variable[key] = this.convertVariableType(variable[key], type[key])
        } else {
          variable[key] = this.convertVariableType(variable[key], type)
        }
      }
    }
    return variable
  }

}

module.exports = LookupR
