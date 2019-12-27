import BaseReducer from './BaseReducer';

class UtilityReducer extends BaseReducer {
  get actionsAllow() {
    return {
      "notify": this.notify,
    }
  }

  get initialState() {
    return {
      notify: {}
    }
  }

  notify = (state, action) => {
    return {
      ...state,
      notify: action.data
    }
  }
}

/**
 * bắt buộc gọi hàm export()
 */
export default UtilityReducer.export()
