const dbconfig = use('config/database')
const MongoClient = use('mongodb').MongoClient
const auth = dbconfig.DB_PASS ? `${dbconfig.DB_USER}:${dbconfig.DB_PASS}@` : ""
const uri = `mongodb://${auth}${dbconfig.DB_HOST}:${dbconfig.DB_PORT}/${dbconfig.DB_NAME}`
const client = new MongoClient()

class Connection {
  constructor() {
    console.log("new connection")
  }

  get connection() {
    if (this._connection && !this._connection.connecting) {
      this.connect()
    }
    return this._connection
  }

  set connection(connection) {
    this._connection = connection
    this._connection.connecting = true
  }

  async connect() {
    try {
      let mongoClient = await client.connect(uri, {
        native_parser: true,
        poolSize: dbconfig.DB_POOL_SIZE || 10
        //socketTimeoutMS: 500
      })
      this.client = mongoClient
      this.client.on('reconnectFailed', (err) => {
        this._connection.connecting = false;
      });
      this.connection = mongoClient.db(dbconfig.DB_NAME)

      return this.connection || {}
    } catch (e) {
      console.error(e)
    }
  }
}

module.exports = Connection
