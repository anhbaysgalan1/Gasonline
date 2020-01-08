import React from 'react';
import {connect} from 'react-redux';
import {withRouter} from 'react-router-dom';
import AreaAction from 'actions/AreaAction';
import CustomerAction from 'actions/CustomerAction';
import OrderAction from 'actions/OrderAction';
import BaseContainer, {selector} from 'containers/BaseContainer';
import View from 'views/Order/Create';
import Utils from 'helpers/utility';
import {I18n} from 'helpers/I18n';

class Create extends BaseContainer {
  constructor(props) {
    super(props);
    this.onSubmit = this.onSubmit.bind(this);
  }

  componentDidMount() {
    this.props.dispatch(CustomerAction.fetchAll({pageSize: -1}));
    this.props.dispatch(AreaAction.fetchAll({pageSize: -1}));
  }

  onSubmit(values) {
    const details = Utils.formatDataOrderDetails(values.orderDetails);
    // validate orderDetails
    if (!this.isInvalidData(details)) {
      // debugger
      // values.orderDetails = details;
      this.createOrder(values)
    }
  }

  isInvalidData(data) {
    //check empty data
    if (data.every(item => item.quantity === 0)) {
      this.notify(I18n.t('Validate.emptyFuelsOrder'), 'error');
      return true;
    }
    return false;
  }

  createOrder(values) {
    const {checkbox, ...order} = values;
    console.log('values', values)
    console.log('order >>>>>> ', order)
    this.props.dispatch(OrderAction.create(order))
      .then(data => {
        if (!data.error) {
          this.notify(I18n.t('Message.success.order.create'))
          this.goto("/orders")
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
    customers: selector(state, 'customer.list.list_data', []),
    areas: selector(state, 'area.list.list_data', [])
  }
}

export default withRouter(connect(mapStateToProps)(Create))
