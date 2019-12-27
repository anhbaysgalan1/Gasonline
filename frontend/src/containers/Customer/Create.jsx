import React from 'react';
import {withRouter} from 'react-router-dom';
import {connect} from 'react-redux';
import CustomerAction from '../../actions/CustomerAction';
import BaseContainer, {selector} from 'containers/BaseContainer';
import View from 'views/Customer/Create';
import {I18n} from 'helpers/I18n';

class Create extends BaseContainer {
  constructor(props) {
    super(props)
    this.onSubmit = this.onSubmit.bind(this)
  }

  onSubmit(values) {
    const {rePassword, ...othervalues} = values;
    this.props.dispatch(CustomerAction.create(othervalues))
      .then(data => {
        if (!data.error) {
          this.notify(I18n.t('Message.success.create'))
          this.goto('/customers')
        } else {
          this.notify(`Response: [${data.error.status}] ${data.error.message}`, 'error')
        }
      })
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
    customer: selector(state, "customer.data", {}),
  }
}

export default withRouter(connect(mapStateToProps)(Create))
