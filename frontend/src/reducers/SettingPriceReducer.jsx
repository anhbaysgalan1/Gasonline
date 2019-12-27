import BaseReducer from './BaseReducer';

class SettingPrice extends BaseReducer {
  get actionsAllow() {
    return {
      ...super.actionsAllow,
      "SettingPrice.edit": {
        path: "data"
      },
      "SettingPrice.fetch": {
        path: "data"
      },
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

/*
 * bắt buộc gọi hàm export()
 */
export default SettingPrice.export()
