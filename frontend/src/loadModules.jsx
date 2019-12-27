import React from 'react'
import {BrowserRouter, Route, Switch, Redirect} from 'react-router-dom';
import Login from './layouts/Login'
import Main from './layouts/Main'
import withRoot from './withRoot';
import ErrorBoundary from 'components/ErrorBoundary/ErrorBoundary';

class Routes extends React.Component {
  checkJWTToken() {
    try {
      let user = localStorage.getItem('user')
      if (!user) return false

      let token = localStorage.getItem('token')
      if (!token) return false

      let base64Url = token.split('.')[1];
      let base64 = base64Url.replace('-', '+').replace('_', '/');
      let decodedToken = JSON.parse(window.atob(base64));
      let dateNow = Date.now() / 1000;
      if (decodedToken.exp && decodedToken.exp < dateNow) return false
      return true
    } catch (e) {
      return false;
    }
  }

  render() {
    return (
      <ErrorBoundary>
        <BrowserRouter>
          <Switch>
            <Route path="/login" name="Login Page" component={() => <Login/>}/>
            <Route path="/" render={(props) => (
              this.checkJWTToken()
                ? (<Main {...props} />)
                : (<Redirect to={{
                  pathname: '/login',
                  state: {
                    from: props.location
                  }
                }}/>))}/>
          </Switch>
        </BrowserRouter>
      </ErrorBoundary>
    )
  }
}

export default withRoot(Routes)
