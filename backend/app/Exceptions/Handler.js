class ExceptionHandler {

  async handle(error, {request, response}){
    let code = 500, message = "", data = {}
    if(typeof error !== "object"){
      error = new Error(error)
    }
    code = Number(error.code) || 500
    message = error.message || ""
    console.log(message)
    data = error.data || error.stack || {}
    const exceptionName = error.constructor.name
    /* if(exceptionName === "HttpException"){
      //handler HttpException here
    } */

    response.error(code, message, data)
  }
}

module.exports = ExceptionHandler
