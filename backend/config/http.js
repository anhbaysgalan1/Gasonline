const {HOST, PORT} = process.env;

module.exports = {
  HOST: HOST || "127.0.0.1",
  PORT: PORT || "3000"
}
