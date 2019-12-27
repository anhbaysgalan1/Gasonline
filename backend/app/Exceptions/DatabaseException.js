
const Exception = use("Exception")
class DatabaseException extends Exception{

  constructor(error =""){
    let message = error
    if(typeof error != "string"){
      message = error.message
    }

    let data = {}
    if(error.name === "MongoError"){
      message = `[Database Error]: ${error.message}`
      data = error.stack
    }
    super(500, message, data);
  }
}

module.exports = DatabaseException
