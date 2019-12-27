import BaseReducer from './BaseReducer';

class LoadingReducer extends BaseReducer {
  get actionsAllow() {
    return {
      ...super.actionsAllow,
      "loading": this.loading
    }
  }

  get initialState() {
    return false
  }

  loading = (state, action) => {
    return action.data
  }
}

/**
 * bắt buộc gọi hàm export()
 */
export default LoadingReducer.export()
