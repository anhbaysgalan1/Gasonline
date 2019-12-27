import _ from 'lodash'

class BaseReducer {
  static export() {
    const self = new (this)()
    return self.fnCall.bind(self)
  }

  /**
   * state mặc định của reducer
   */
  get initialState() {
    return {
      lastType: null,
      isLoading: false,
      list: {},
      item: {},
      data: {},
    }
  }

  /**
   * Khai báo tất cả các action được sử dụng trong reducer vào actionsAllow.
   */
  get actionsAllow() {
    return {}
  }

  /**
   * Hàm private sử dụng để call các action tương ứng
   * @param {*} state
   * @param {*} action
   */
  fnCall(state, action) {
    if (!state) state = this.initialState
    if (this.actionsAllow[action.type] !== undefined) {
      //nếu được khai báo trong actionsAllow
      if (typeof this.actionsAllow[action.type] == "function") {
        //nếu kiểu dữ liệu là function thì gọi vào trong function
        return this.actionsAllow[action.type](state, action);
      } else {
        //nếu kiểu dữ liệu là object thì tự động chèn dữ liệu vào đúng path đã setting
        const path = this.actionsAllow[action.type].path || "data"
        let newState = {}
        _.set(newState, path, action.data) //chèn dữ liệu vào path
        //state = _.merge(state, newState) //merge dữ liệu vào state cũ
        state = {
          ...state,
          ...newState,
          lastType: action.type,
          isLoading: false,
          error: action.error,
        }
      }
    }
    return state
  }

  /**
   * Custom action....
   * functionName(state, action){....}
   */

  clearData = (state) => {
    return {
      ...state,
      item: {}
    }
  }
}

export default BaseReducer
