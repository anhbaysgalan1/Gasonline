const ExceptionHandlerInstance = use("App/Exceptions/Handler")

class Exception {
  static handle(error, request, response) {
    this.request = request
    this.response = response
    error.code = error.code || 500
    error.message = error.message || error
    error.data = error.data || error.stack || {}
    let ExceptionHandler = new ExceptionHandlerInstance()
    ExceptionHandler.handle(error, {request, response})
  }

  constructor(code, message, data) {
    this.code = code
    this.message = message
    this.data = data
  }
}

module.exports = () => {
  return Exception
}
