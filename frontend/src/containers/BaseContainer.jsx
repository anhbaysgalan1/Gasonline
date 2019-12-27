import {Component} from 'react';
import _ from 'lodash';
import UtilityAction from 'actions/UtilityAction';
import Utils from 'helpers/utility';

const defaultOptions = {
  success: null,
  error: null,
  dataKey: "data",
  errorKey: "error",
  lastTypeKey: "lastType"
};

class BaseContainer extends Component {

  getData = (obj, path, defaultValue = undefined) => {
    return Utils._getData(obj, path, defaultValue)
  }

  goto(path) {
    if (!this.props.history) return console.error("need export with withRouter() to redirect page.")

    return this.props.history.push(path)
  }

  handleDataAction(actionObject, actionName, nextProps, options = defaultOptions) {
    options = {...defaultOptions, ...options}
    const lastType = this.getData(nextProps, options.lastTypeKey)
    const type = this.getData(actionObject, `actions.${actionName}.type`)
    const error = this.getData(nextProps, options.errorKey, {})
    const data = this.getData(nextProps, options.dataKey, {})

    if (lastType === undefined || type === undefined) {
      console.error("lastType or action.type is undefined in handleChangeReducer")
      return false
    }
    if (nextProps.lastType !== type) return false
    if (error.status == null) {
      //success
      if (typeof options.success === "function") options.success(data)
      return true
    } else {
      //error
      if (typeof options.error === "function") options.error(error)
      return false
    }
  }

  notify(message, type = "success") {
    this.props.dispatch(UtilityAction.notify({
      message: message,
      type: type
    }))
  }

  setFieldError(fieldName, error) {
    let errorState = {
      ...this.state.error,
      [fieldName]: {
        value: error,
        modifiedAt: new Date()
      }
    }
    this.setState({error: errorState})
  }
}

export default BaseContainer

//tìm giá trị thuộc tính của 1 đối tượng
export const selector = (state, path, defaultValue) => {
  return _.get(state, path, defaultValue)
}
