const BaseMiddleware = use("./BaseMiddleware")
/**
 * Mở rộng chức năng của response
 * success(data): gọi hàm khi có dữ liệu
 * error(code, message, data): gọi hàm khi có lỗi
 */
class ExtendedResponseMiddleware extends BaseMiddleware{
  constructor(request, response, next){
    super(request, response, next)
    this.response = response
    response.success = this.success.bind(this)
    response.error = this.error.bind(this)
    next()
  }

  success(data) {
    this.response.json(data)
  }
  error(code, message = null, data = null){
    this.response.status(code).json({
      message: message,
      data: data
    })
  }
}

module.exports = ExtendedResponseMiddleware.export()
