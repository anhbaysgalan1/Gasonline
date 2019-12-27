import BaseAction from './BaseAction'

class AuthAction extends BaseAction {
  get actions() {
    return {
      register: {
        method: 'post',
        url: '/api/register',
        type: 'Auth.register'
      },
      login: {
        method: 'post',
        url: '/api/login',
        type: 'Auth.login'
      },
      changePassword: {
        method: 'post',
        url: '/api/changePassword',
        type: 'Auth.changePassword'
      }
    }
  }
}

export default AuthAction.export()
