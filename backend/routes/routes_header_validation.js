const router = require('express').Router();
const URL = require('url');

const AuthUtil = require('../app/Utils/auth');
const HttpUtil = require('../app/Utils/http');
const Utils = require('../app/Utils');
const UserModel = require('../app/Models/User');

const FIELDS = ['_id', 'code', 'email', 'fullName', 'firstName', 'lastName', 'role', 'phone', 'driverCards', 'delete'];
const TAG = '[Header-Validation]';

const API_NOT_NEED_AUTH = [
  'api/login',
  'api/register',
  'api/authWithSession',
  'api/test',
  'api/reports'
];

const API_PATH_HEADER = '/api/';

function setHeader(res) {
  //res.setHeader('Cache-Control', 'no-cache');
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET, HEAD, POST, PUT, PATCH, DELETE, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type, Content-Length, Authorization, origin, Accept, lang_code, Last-Modified');
  res.setHeader('Access-Control-Allow-Credentials', true);
  // https://developer.mozilla.org/en-US/docs/Web/HTTP/Headers/Access-Control-Allow-Origin
  // res.setHeader('Vary', "Origin");
  // res.setHeader('Access-Control-Expose-Headers', 'Content-Length');
}

router.use((req, res, next) => {
  /* if (!req.url.includes(API_PATH_HEADER) || req.url.length === 5) {
    HttpUtil.badRequest(res, 'Just accept <host address>' + API_PATH_HEADER + '<module name>');
    return;
  } */

  setHeader(res);
  if (req.method === 'OPTIONS') {
    return res.end();
  }

  // if (!req.headers['content-type'] || req.headers['content-type'] != 'application/json'){
  //     HttpUtil.badRequest(res, 'Missing header param Content-Type={application/json}');
  //     return;
  // }
  // if (!req.headers.lang_code) {
  //   HttpUtil.badRequest(res, 'Missing header param lang_code={vi}');
  //   return;
  // }
  res.pdf = (content) => {
    res.set({'Content-Type': 'application/pdf', 'Content-Length': content.length})
    res.send(content)
  }
  next();
});

router.use((req, res, next) => {
  const apiPath = Utils.trimChar(URL.parse(req.url).pathname, '/');
  const needAuth = API_NOT_NEED_AUTH.indexOf(apiPath) < 0 && !req.url.includes('/api/test/');

  if (!needAuth) {
    return next();
  }

  let ret = Utils.getBearerTokenFromHeader(req);
  if (ret.error) {
    return HttpUtil.unauthorized(res, ret.error);
  }

  // console.log('Token:', ret.token);
  AuthUtil.verify(ret.token, (err, payload) => {
    if (err) {
      console.log('JWT error:', Object.assign({}, err));
      err = {message: `${err.name}: ${err.message}`};

      return HttpUtil.unauthorized(res, err);
    }

    // find authUser;
    UserModel.loadCb(
      payload._id,
      (err, user) => {
        if (err) {
          console.log(TAG + ' getByAccessToken error ', err);
          return HttpUtil.internalServerError(res, `Check authorized failed: ${err.message}`);
        }

        if (!user || (user.delete && user.delete.when)) return HttpUtil.unauthorized(res, 'Unauthorized: Invalid acccess token.');

        user = Utils.cloneObject(user.getFields(FIELDS));
        req.authUser = user;
        req.payload = user;

        return next();
      }
    )
  });
});

module.exports = router;
