class Permission {
  static hasPermission(permission) {
    if (!permission) return true;
    try {
      let user = JSON.parse(localStorage.getItem("user"))
      let userRoles = user.roles || []
      if (userRoles[0] === "*") return true
      return userRoles.includes(permission)
    } catch (e) {
      console.warn(e)
      return false
    }
  }
}

export default Permission;
