
const Exception = use("Exception")
class ApiException extends Exception{

  constructor(code, message, data){
    super(code, message, data);
  }
}

module.exports = ApiException
