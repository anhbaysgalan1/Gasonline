import BaseReducer from './BaseReducer';

class AuthReducer extends BaseReducer {
  get actionsAllow() {
    return {
      ...super.actionsAllow,
      "Auth.register": {
        path: "data"
      },
      "Auth.login": {
        path: "data"
      },
      "Auth.changePassword": {
        path: "data"
      }
    }
  }

  get initialState() {
    return {
      ...super.initialState,
      error: {
        message: null
      }
    }
  }
}

export default AuthReducer.export()
