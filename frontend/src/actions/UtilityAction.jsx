import BaseAction from './BaseAction'

class UtilityAction extends BaseAction {
  get actions() {
    return {
    }
  }

  notify({ message, type = "info" }) {
    return (dispatch) => {
      dispatch({
        type: "notify",
        data: {
          message: message,
          type: type
        }
      })
    }
  }
}
/**
 * bắt buộc gọi hàm export()
 */
export default UtilityAction.export()