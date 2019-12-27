import React from 'react';
import View from 'views/Driver/Create';
import DriverAction from '../../actions/DriverAction'
import BaseContainer, {selector} from 'containers/BaseContainer';
import {withRouter} from 'react-router-dom'
import {connect} from 'react-redux'
import {I18n} from 'helpers/I18n';

class Create extends BaseContainer {
  constructor(props) {
    super(props);
    this.onSubmit = this.onSubmit.bind(this)
  }

  //Submit khi k có error
  onSubmit(values, isError) {
    console.log("values", values)
    const {rePassword, ...othervalues} = values
    if (!isError) {
      this.props.dispatch(DriverAction.create(othervalues))
        .then(data => {
          if (!data.error) {
            this.notify(I18n.t('Message.success.create'))
            this.goto('/drivers')
          } else {
            this.notify(`Response: [${data.error.status}] ${data.error.message}`, 'error')
          }
        })
    }
  }

  render() {
    return (
      <View
        onSubmit={this.onSubmit}
        {...this.props}
      />
    );
  }
}

const mapStateToProps = state => {
  return {
    data: selector(state, "driver.data", {})
  }
}

export default withRouter(connect(mapStateToProps)(Create))
