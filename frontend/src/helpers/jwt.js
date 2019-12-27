class jwt {
  static decode(token) {
    try {
      let base64Url = token.split('.')[1];
      let base64 = base64Url.replace('-', '+').replace('_', '/');
      return JSON.parse(window.atob(base64));
    } catch (e) {
      console.error("can not decode jwt token!")
      return {}
    }
  }
}

export default jwt;
