const BaseMiddleware = use("./BaseMiddleware")
const Auth = use("Auth")
class AuthMiddleware extends BaseMiddleware{
  constructor(request, response, next){
    super(request, response, next)
    let token = request.headers.authorization || ""
    this.checkToken(token)
  }

  async checkToken(jwtToken){
    let token = jwtToken.split(" ")
    if(token[0] != "Bearer"){
      return this.response.error(401)
    }

    let [error, result] = await to(Auth.verify(token[1]))
    if(error){
      return this.response.error(401, error.message)
    }
    this.request.auth = this.makeAuthObject(result)
    this.next();
  }

  makeAuthObject(tokenData){
    return{
      data: tokenData
    }
  }
}

module.exports = AuthMiddleware.export()
