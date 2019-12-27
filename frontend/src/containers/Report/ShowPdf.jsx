import React from 'react';
import CustomerAction from 'actions/CustomerAction';
import OrderAction from 'actions/OrderAction';

import BaseContainer, {selector} from 'containers/BaseContainer';
import {withRouter} from 'react-router-dom'
import {connect} from 'react-redux';
import {MyDocument} from 'views/Report/ShowPdf';

class Index extends BaseContainer {
  constructor(props) {
    super(props)
  }

  componentDidMount() {
    this.size = this.props.match.params.size;
    this.date = this.props.match.params.date;
    console.log("this.size", this.size)
    this.props.dispatch(OrderAction.fetchAll({pageSize: -1})); //nên fetch order theo ngày luôn ở đây
    this.props.dispatch(CustomerAction.fetchAll({pageSize: -1}));
  }

  render() {
    if (this.props.isOk) {
      return (
        <MyDocument
          {...this.props}
          size={this.size}
          date={this.date}
        />
      )
    } else {
      return false //loading
    }
  }
}

const mapStateToProps = state => {
  console.log("state", state)
  let customers = selector(state, "customer.list.data", undefined);
  let orders = selector(state, "order.list.data", undefined)

  return {
    customers: selector(state, "customer.list.data", []),
    orders: selector(state, "order.list.data", []),
    isOk: Boolean(customers) && Boolean(orders)
  }
}

export default withRouter(connect(mapStateToProps)(Index))
