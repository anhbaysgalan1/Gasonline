import React from 'react';
import {withRouter} from 'react-router-dom';
import {connect} from 'react-redux';
import CustomerAction from '../../actions/CustomerAction';
import BaseContainer, {selector} from 'containers/BaseContainer';
import View from 'views/Customer/Edit';
import {I18n} from 'helpers/I18n';

class Edit extends BaseContainer {
  constructor(props) {
    super(props)
    this.onSubmit = this.onSubmit.bind(this)
  }

  componentDidMount() {
    this.id = this.props.match.params.id
    this.props.dispatch(CustomerAction.fetch({id: this.id}))
  }

  onSubmit(values) {
    console.log('update customer value: ', values);
    try {
      this.props.dispatch(CustomerAction.edit({
          id: this.id,
          ...values
        }))
        .then(data => {
          if (!data.error) {
            this.notify(I18n.t('Message.success.update'))
            this.goto('/customers')
          } else {
            console.log("data.error", data)
            this.notify(`Response: [${data.error.status}] ${data.error.message}`, 'error')
          }
        })
    } catch (error) {
      console.log("error", error)
    }
  }

  render() {
    return (
      <View
        customer={this.props.customer}
        onSubmit={this.onSubmit}
        {...this.props}
      />
    );
  }
}

const mapStateToProps = state => {
  return {
    customer: selector(state, "customer.item", {}),
  }
}

export default withRouter(connect(mapStateToProps)(Edit))
