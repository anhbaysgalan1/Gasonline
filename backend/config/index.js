const path = require('path');

const rootPath = process.cwd();
const {FORMAT_DATE = 'YYYY-MM-DD'} = process.env;
const {UPLOAD_HOST, UPLOAD_PORT, UPLOAD_DIR_PATH} = require('./upload');
const {DB_HOST, DB_PORT, DB_NAME, DB_USER, DB_PASS} = require('./database');
const {HOST, PORT} = require('./http');

const downloadHost = (UPLOAD_PORT !== '80') ? `${UPLOAD_HOST}:${UPLOAD_PORT}` : UPLOAD_HOST;
const dbConnectURI = `mongodb://${DB_USER}:${DB_PASS}@${DB_HOST}:${DB_PORT}/${DB_NAME}`;

const pdfMakeFonts = require('../libs/pdfmake/fonts.json');
let settings = require('./setting.json');

module.exports = {
  ...settings,
  rootPath: rootPath,
  backendHost: HOST,
  backendPort: PORT,
  configDir: path.join(rootPath, 'config'),
  excelFolder: 'gasonline',
  formatDate: FORMAT_DATE,
  // config for project
  mongodb: {
    dbConnectURI: dbConnectURI,
    options: {
      useCreateIndex: true,
      useNewUrlParser: true,
      useUnifiedTopology: true
      // db: {
      //   safe: true
      // }
    }
  },
  downloadHost: downloadHost,
  downloadDir: UPLOAD_DIR_PATH,
  pdfMakeFonts: pdfMakeFonts,

  // config thời gian giao hàng
  deliveryTime: {
    morning: 1, // buổi sáng
    afternoon: 2, // buổi chiều
    anytime: 3, // mọi lúc trong ngày
  },
  // config trạng thái của đơn hàng
  statusOrder: {
    waiting: 1, // đang chờ
    divided: 2, // đã phân chia người giao hàng
    delivered: 3, // đã giao hàng
  },
  // config types của histories pouring fuels
  typePouring: {
    import: 1,
    export: 2
  },

  filters: {
    dataTypes: {
      text: 'text',
      date: 'date',
      number: 'number',
    },
    types: {}
  }
};
