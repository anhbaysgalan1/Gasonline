class BaseMiddleware{
  constructor(request, response, next){
    // console.log()
    this.request = request
    this.response = response
    this.next = next
  }
  static export(){
    return (...params) => new (this)(...params)
  }
}

module.exports = BaseMiddleware
