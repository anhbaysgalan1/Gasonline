const LookupRInstance = use("./LookupR")
class Aggregation{
  constructor(model, aggregations = [], options = {}){
    this.model = model
    this.collection = model.collection
    this.aggregations = aggregations
    this.options = options
    let LookupRClass = new LookupRInstance(model, this)
    this.lookupR = LookupRClass.lookupR.bind(LookupRClass)
  }
  setOptions(options){
    this.options = options
    return this
  }

  set(aggregations){
    if(!aggregations){
      throw new Error("Aggregation.set([Array]) requires parameters.")
    }
    if(!Array.isArray(aggregations)) aggregations = [aggregations]
    this.aggregations = [
      ...this.aggregations,
      ...aggregations
    ]
    return this
  }

  add(aggregations){
    return this.set(aggregations)
  }
  push(aggregations){
    return this.set(aggregations)
  }
  get(){
    return this.aggregations
  }
  pop(){
    return this.aggregations.pop()
  }
  remove(start, count){
    this.aggregations.splice(start, count)
  }
  afterQuery(fnAfterQuery){
    this.fnAfterQuery  = fnAfterQuery
    return this
  }
  clone(){
    return new Aggregation(this.model, this.aggregations, this.options)
  }
  async run(){
    try{
      let result = await this.collection.aggregate(this.aggregations, this.options).toArray()
      if(typeof this.fnAfterQuery === "function") result = this.fnAfterQuery(result)
      return result
    }
    catch(error){
      console.error(error)
    }
  }
}

module.exports = Aggregation
