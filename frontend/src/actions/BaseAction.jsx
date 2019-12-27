import http from '../helpers/http'
import UrlPattern from 'url-pattern'

class BaseAction {
  /**
   * export sử dụng khi export action
   */
  static export() {
    const self = new (this)()
    self.makeActionFromList()
    return self
  }

  constructor() {
    this.http = http
  }

  get actions() {
    return {
      create: {method: 'post', url: '', type: ''},
      edit: {method: 'put', url: '', type: ''},
      patch: {method: 'patch', url: '', type: ''},
      destroy: {method: 'delete', url: '', type: ''},
      delete: {method: 'delete', url: '', type: ''},
      fetch: {method: 'get', url: '', type: ''},
      fetchAll: {method: 'get', url: '', type: ''},
    }
  }

  makeActionFromList() {
    let listAction = Object.keys(this.actions);
    listAction.forEach((action) => {
      this[action] = (params) => {
        let {method, url, type} = this.actions[action];
        //build url từ pattern khai báo trong actions
        let pattern = new UrlPattern(url, {segmentNameCharset: 'a-zA-Z0-9_-'});
        url = pattern.stringify(params);
        return this.requestApi(method, url, params, type)
      }
    })
  }

  requestApi(method, url, params, actionType) {

    return async (dispatch) => {
      //set loading = true
      dispatch({
        type: "loading",
        data: true
      })
      let result;
      try {
        //await new Promise(r => setTimeout(r, 3000))
        let response = await this.http[method](url, params)
        result = this.formatResponse(response, actionType);
      } catch (e) {
        result = this.formatResponse(e.response, actionType);
      }
      dispatch(result)
      dispatch({
        type: "loading",
        data: false
      })
      return result
    }
  }

  /**
   * format lại dữ liệu trước khi dispatch đối với dữ liệu là response sau khi call api (http)
   * @param {*} response
   * @param {*} actionType
   */
  formatResponse(response, actionType) {
    let result = {
      type: actionType,
      data: null,
      message: null,
      error: null
    };
    if (!response) {
      result.error = {
        status: -1,
        message: "Request Failed"
      }
      return result
    }
    let {status} = response;
    let {message, data} = response.data;
    if ([200, 201].indexOf(status) > -1) {
      result.data = data;
      result.message = message;
    } else {
      result.error = {status, message}
    }
    return result;
  }
}

export default BaseAction;
