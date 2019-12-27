import React from 'react';
import {connect} from 'react-redux';
import {withRouter} from 'react-router-dom';
import OrderAction from 'actions/OrderAction';
import CustomerAction from 'actions/CustomerAction';
import AreaAction from 'actions/AreaAction';
import BaseContainer, {selector} from 'containers/BaseContainer';
import View from 'views/Order/Edit';
import Utils from 'helpers/utility';
import {I18n} from 'helpers/I18n';

class Edit extends BaseContainer {
  constructor(props) {
    super(props)
    this.onSubmit = this.onSubmit.bind(this)
  }

  componentDidMount() {
    this.id = this.props.match.params.id
    this.props.dispatch(OrderAction.fetch({id: this.id}));
    this.props.dispatch(CustomerAction.fetchAll({pageSize: -1}));
    this.props.dispatch(AreaAction.fetchAll({pageSize: -1}));
  }

  onSubmit(values) {
    const fuels = Utils.formatDataOrderDetails(values.orderDetails); // thay đổi cả values
    if (!this.isInvalidData(fuels)) {
      console.log("SUBMIT: ", values);
      // debugger
      this.editOrder(values);
    }
  }

  editOrder(values) {
    const {checkbox, ...order} = values;
    console.log("SUBMIT: ", order);
    this.props.dispatch(OrderAction.edit({
        id: this.id,
        ...order
      }))
      .then(data => {
        if (!data.error) {
          this.notify(I18n.t('Message.success.update'))
          this.goto("/orders")
        } else {
          this.notify(`Response: [${data.error.status}] ${data.error.message}`, 'error')
        }
      })
  }

  isInvalidData(data) {
    //check empty data
    if (data.every(item => item.quantity === 0)) {
      this.notify(I18n.t('Validate.emptyFuelsOrder'), 'error');
      return true;
    }
    return false;
  }

  render() {
    return (
      <View
        onSubmit={this.onSubmit}
        {...this.props} // truyền tất cả props vào 
      />
    );
  }
}

const mapStateToProps = state => {
  return {
    order: selector(state, "order.item", {}),
    customers: selector(state, 'customer.list.list_data', []),
    areas: selector(state, 'area.list.list_data', [])
  }
}

export default withRouter(connect(mapStateToProps)(Edit))
