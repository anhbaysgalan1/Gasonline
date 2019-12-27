import React from 'react';
import {connect} from 'react-redux';
import {withRouter} from 'react-router-dom';
import AuthAction from 'actions/AuthAction';
import UtilityAction from 'actions/UtilityAction';
import BaseContainer, {selector} from 'containers/BaseContainer';
import Login from 'views/Login/Login';
import {httpStatus} from "config/constant";
import Utils from 'helpers/utility';

class LoginContainer extends BaseContainer {
  constructor(props) {
    super(props)
    this.state = {
      error: {
        password: {
          value: undefined,
          modifiedAt: undefined
        }
      }
    }
  }

  componentWillReceiveProps(nextProps) {
    const error = this.getData(nextProps, "error", null)
    if (!error) {
      const data = this.getData(nextProps, "data")
      let {token, user} = data;
      localStorage.setItem('token', token)
      localStorage.setItem('user', JSON.stringify(user))
      this.props.history.push(Utils.defineDefaultIndex())
    } else {
      if (error.status === httpStatus.BAD_REQUEST) {
        this.setFieldError("password", error.message)
      } else {
        this.props.dispatch(UtilityAction.notify({
          message: `Response: [${error.status}] ${error.message}`,
          type: "error"
        }))
      }
    }
    this.state.modifiedAt = new Date(0)
  }

  onSubmit(values) {
    this.props.dispatch(AuthAction.login(values))
  }

  render() {
    return <Login
      onSubmit={values => this.onSubmit(values)}
      error={this.state.error}
    />
  }
}

const mapStateToProps = state => {
  return {
    isLoading: selector(state, "auth.isLoading", false),
    error: selector(state, "auth.error", ""),
    data: selector(state, "auth.data", {}),
  }
}

export default withRouter(connect(mapStateToProps)(LoginContainer))
