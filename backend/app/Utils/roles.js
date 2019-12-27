const HttpUtil = require('./http');
const Utils = require('./index');
const {roles} = require('../../config');

module.exports = {
  RoleMap: roles,

  isAdmin: function (authUser) {
    return userHasRole(authUser, this.RoleMap.admin);
  },

  isRoot: function (authUser) {
    return authUser.email === this.RoleMap.root || (authUser.role && authUser.role === this.RoleMap.root);
  },

  isValidRole(role, array = []) {
    if (array.length === 0) array = Object.values(this.RoleMap);
    return array.indexOf(role) > -1;
  },

  checkRole: function (req, res, next, requireRole) {
    let user = HttpUtil.headers(req).authUser;
    if (_hasRole(user, requireRole)) {
      next();
    } else {
      return HttpUtil.forbidden(res, Utils.localizedText('Permission_Denied'));
    }
  },

  // check user có ít nhất 1 quyển trong mảng roles
  // roles: mảng chứa roleId
  hasRole: function (user, roles) {
    return _hasRole(user, roles);
  },
};

function userHasRole(user, roleCode) {
  return (user.role && user.role === roleCode);
}

function _hasRole(user, roles) {
  if (!user || !user.role || !roles) {
    return false;
  }
  if (roles === 'DEFAULT') {
    return true;
  }
  if (!Utils.isArray(roles)) {
    roles = [roles];
  }
  return roles.indexOf(user.role) > -1;
}
