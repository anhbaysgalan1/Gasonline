import React from 'react';
import {withRouter} from 'react-router-dom';
import {connect} from 'react-redux';
import OrderAction from '../../actions/OrderAction';
import VehicleAction from '../../actions/VehicleAction';
import BaseContainer, {selector} from 'containers/BaseContainer';
import View from 'views/DivideOrder/Index';
import {I18n} from 'helpers/I18n';
// import {statusOrder, dateFormatDefault} from 'config/constant';
// import moment from 'moment';

class Index extends BaseContainer {
  constructor(props) {
    super(props);
    this.loadData = this.loadData.bind(this);
    this.onSubmit = this.onSubmit.bind(this);
    this.onRefTable = this.onRefTable.bind(this);
    this.onNotifyHaveParams = this.onNotifyHaveParams.bind(this);
    this.onCancelSelected = this.onCancelSelected.bind(this);
    this.validateBeforeSubmit = this.validateBeforeSubmit.bind(this);
  }

  onRefTable(ref) {
    this.refTable = ref
  }

  componentDidUpdate(prevProps) {
    //example for check props change
    /* if(prevProps.x !== this.props.x){
      //props x changed
    } */
  }

  loadData(date) {
    this.props.dispatch(OrderAction.fetchDaily({pageSize: -1, date: date || undefined}));
    this.props.dispatch(VehicleAction.fetchAll({pageSize: -1}));
  }

  componentDidMount() {
    this.loadData()
  }

  submitOrderSort = (values) => {
    console.log("submitOrderSort >> ", values)
  }

  async onSubmit(values) {
    console.log('onSubmit divide orders -- values:', values)
    this.props.dispatch(OrderAction.divide(values))
      .then(data => {
        if (!data.error) {

          // this.props.dispatch(OrderAction.fetchAll({pageSize: -1}));
          this.notify(I18n.t('Message.success.update'));
          this.goto('/divide-order')
          // if (this.refTable) {
          //   this.refTable.onSelectionChange([]) //gọi method của con thông qua ref
          // }
        } else {
          this.notify(`Response: [${data.error.status}] ${data.error.message}`, 'error')
        }
      })
  }

  onNotifyHaveParams(orderIdParam) {
    let message = I18n.t('Message.divideOrder.haveParams');
    try {
      eval(`message=\`${message}\``)
    } catch (e) {
      console.error("can not build message for onNotifyHaveParams function.")
    }
    this.notify(message, "info");
  }

  validateBeforeSubmit(message, type = "info") {
    this.notify(message, type);
  }

  onCancelSelected() {
    if (this.refTable) {
      this.refTable.onSelectionChange([]) //gọi method API của con thông qua ref
    }
  }

  render() {
    return (<View
      loadData={this.loadData}
      onFetchData={this.onFetchData}
      onSubmit={this.onSubmit}
      onRefTable={this.onRefTable}
      orders={this.props.orders}
      onNotifyHaveParams={this.onNotifyHaveParams}
      onCancelSelected={this.onCancelSelected}
      validateBeforeSubmit={this.validateBeforeSubmit}
      submitOrderSort={this.submitOrderSort}
      {...this.props}
    />);
  }
}

const mapStateToProps = state => {
  return {
    orders: selector(state, "order.listDaily", []),
    trucks: selector(state, "vehicle.list.list_data", [])
  }
}

export default withRouter(connect(mapStateToProps)(Index))
