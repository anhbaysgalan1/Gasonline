const {UPLOAD_HOST, UPLOAD_PORT, UPLOAD_DIR_PATH} = process.env;

module.exports = {
  UPLOAD_HOST: UPLOAD_HOST || 'http://localhost',
  UPLOAD_PORT: UPLOAD_PORT || '8080',
  UPLOAD_DIR_PATH: UPLOAD_DIR_PATH || '/var/www/upload/'
}