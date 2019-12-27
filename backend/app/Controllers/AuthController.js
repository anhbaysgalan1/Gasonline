const to = require('await-to-js').default;
const AuthUtil = require('../Utils/auth');
const HttpUtil = require('../Utils/http');
const Utils = require('../Utils');
const User = require('../Models/User');
const {roles} = require('../../config')

let Authentication = {

  async register(req, res) {
    const requireParams = ['email', 'firstName', 'lastName', 'password']; // password phải được đặt cuối cùng.
    let params = HttpUtil.getRequiredParamsFromJson2(req, requireParams);
    if (params.error) return HttpUtil.badRequest(res, params.error);

    let [err, user] = await to(User.getOne({email: params.email}));
    if (err) return HttpUtil.internalServerError(res, Utils.localizedText('Found_Errors.user', err.message));

    if (user) return HttpUtil.unprocessable(res, Utils.localizedText('Unique.user.email', params.email));

    let {email, firstName, lastName, password} = params;
    let {salt, hash} = AuthUtil.setPassword(password);
    let obj = {email, firstName, lastName, role: roles.admin, salt, hash};

    [err, user] = await to(User.insertOne(obj));
    if (err) return HttpUtil.internalServerError(res, Utils.localizedText('Errors.register', err.message));

    user = user.getFields();
    user = Utils.cloneObject(user);
    let token = AuthUtil.generateJwt(user);
    req.session.token = token
    return HttpUtil.success(res, {token: token, user}, 'Success.register');
  },

  async login(req, res) {
    const requireParams = ['username', 'password'];
    let params = HttpUtil.getRequiredParamsFromJson2(req, requireParams);
    if (params.error) return HttpUtil.badRequest(res, params.error);

    let {username, password} = params;
    let condition = {$or: [{email: username}, {code: username}]};

    let [err, user] = await to(User.getOne(condition, {}));
    if (err) return HttpUtil.unauthorized(res, err);

    if (!user || user.delete) return HttpUtil.unprocessable(res, Utils.localizedText('Not_Exists.user', username))
    if (!AuthUtil.validPassword(user, password)) return HttpUtil.badRequest(res, 'Errors.Incorrect_Password')

    let token = AuthUtil.generateJwt(user);
    ['hash', 'salt', '__v', 'update', 'insert'].forEach(field => delete user[field]);
    req.session.token = token

    return HttpUtil.success(res, {token: token, user: user}, 'Success.login');
  },

  async changePassword(req, res) {
    const requireParams = ['old_password', 'new_password', 'retype_password'];
    let params = HttpUtil.getRequiredParamsFromJson2(req, requireParams);
    if (params.error) return HttpUtil.badRequest(res, params.error);

    if (!Utils.compareString(params.new_password, params.retype_password)) {
      return HttpUtil.badRequest(res, "Errors.Pw_Not_Match");
    }

    if (Utils.compareString(params.old_password, params.new_password)) {
      return HttpUtil.badRequest(res, 'Errors.New_Old_Pw_Must_Different');
    }

    let object = req.authUser;
    if (!object || !object._id) return HttpUtil.unauthorized(res, 'unauthorized');

    let err, user;
    [err, user] = await to(User.getOne({_id: object._id}));
    if (err) return HttpUtil.internalServerError(res, Utils.localizedText('Found_Errors.user', err.message));

    if (!user) return HttpUtil.notFound(res, Utils.localizedText('Not_Exists.user', object._id));

    if (!AuthUtil.validPassword(user, params.old_password)) return HttpUtil.unprocessable(res, 'Errors.Old_Pw_Not_Match');

    let objUpdate = AuthUtil.setPassword(params.new_password);
    [err, user] = await to(User.updateOne(user._id, objUpdate));
    if (err) return HttpUtil.internalServerError(res, Utils.localizedText('Errors.Change_Password', err.message));

    return HttpUtil.success(res, 'Success.Change_Password');
  },

  async authWithSession(req, res){
    req.session.token = req.query.token
    let redirectUrl = req.query.redirect || "/"
    res.redirect(redirectUrl)
  }
}

module.exports = Authentication;
