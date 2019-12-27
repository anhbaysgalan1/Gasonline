import axios from 'axios';
import _ from 'lodash';

class Http {
  //override hisitory
  static Whistory = {
    push: (path) => {
      window.history.pushState("", "", path)
      window.history.go()
    }
  }

  static init() {
    let token = localStorage.getItem('token')
    axios.defaults.headers.common['Authorization'] = `Bearer ${token}`;
    axios.interceptors.response.use(this.handleGlobal.bind(this), this.handleGlobalError.bind(this));
  }

  static initOnce(props) {
    this.history = props.history
    this.location = props.location
    //axios.interceptors.response.use(this.handleGlobal.bind(this), this.handleGlobalError.bind(this));
  }

  static handleGlobal(response) {
    return response
  }

  static handleGlobalError(error) {
    let status = _.get(error, "response.status", -1);
    if (status === 401) {
      console.warn("Token expired")
      localStorage.removeItem("token");
      if (window.location.pathname !== "/login") (this.history || this.Whistory).push('/login')
    }
    if (status === 404) {
      console.warn('404');
      //(this.history || this.Whistory).push('/404')
    }
    return Promise.reject(error)
  }

  static getAppUrl() {
    //return window.location.origin + "/"
    return window.config.API_HOST
  }

  static async get(url, data = {}) {
    this.init()
    return await axios.get(this.getAppUrl() + url, {params: data})
  }

  static async post(url, data) {
    this.init()
    return  await axios.post(this.getAppUrl() + url, data)
  }

  static async put(url, data) {
    this.init()
    return await axios.put(this.getAppUrl() + url, data)
  }

  static async patch(url, data) {
    this.init()
    return await axios.patch(this.getAppUrl() + url, data)
  }

  static async delete(url, data) {
    this.init()
    return await axios.delete(this.getAppUrl() + url, {params: data})
  }
}

export default Http;
