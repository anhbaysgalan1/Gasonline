import React from 'react';
import View from 'views/Pay/Index'
import ReportAction from '../../actions/ReportAction';
import CustomerAction from '../../actions/CustomerAction'
import BaseContainer, {selector} from 'containers/BaseContainer';
import {withRouter} from 'react-router-dom'
import {connect} from 'react-redux'
import {I18n} from 'helpers/I18n';
import moment from 'moment'

class Index extends BaseContainer {
  constructor(props) {
    super(props)
    this.refTable = null
    this.onFetchData = this.onFetchData.bind(this)
    this.onRefTable = this.onRefTable.bind(this)
    this.filters = {}
  }

  componentDidMount(){
    this.onFetchData({})
  }


  getInvoiceDate(state){
    let startDate, endDate;
    if(state.paymentTerm == "end"){
      startDate = moment().format(`YYYY-${state.month}-01 00:00:00`)
      endDate = moment(startDate).endOf("month").format(`YYYY-MM-DD 00:00:00`)
    }
    else{
      endDate = moment().format(`YYYY-${state.month}-${state.paymentTerm} 00:00:00`)
      startDate = moment(endDate).subtract(1,'months').add(1,'days').format(`YYYY-MM-DD 00:00:00`)
    }
    return {
      startDate,
      endDate
    }
  }
  onFetchData = (state) => {
    // console.log("onFetchData", state)
    //phải đổi cái này thành Payment Action
    this.invoiceDate = this.getInvoiceDate(state)
    console.log("xxx1", state)
    this.filters = state;
    this.props.dispatch(ReportAction.fetchInvoices({
      ...state,
      ...this.invoiceDate
    }))
  }

  loadUser = (filters) => {
    console.log("loadUser", filters)
    //build lại conditions cho phù hợp với search api
    let conditions = [
      {columnName: "type", value: filters['type'], operation: 'equal', "dataType": "number"},
      {columnName: "paymentTerm", value: filters['paymentTerm'], operation: 'equal', "dataType": "text"},
    ]
    this.props.dispatch(CustomerAction.fetchAll({
      filters: conditions,
      pageSize: -1
    }))
  }

  onRefTable(ref) {
    this.refTable = ref
  }


  render() {
    console.log(this.filters)
    return (
    <View
      onFetchData={this.onFetchData}
      loadUser={this.loadUser}
      onRefTable={this.onRefTable}
      onDeleteData={this.onDeleteData}
      invoices={this.props.invoices}
      customers={this.props.customers}
      invoiceDate={this.invoiceDate}
      filters={this.filters}
    />);
  }
}

const mapStateToProps = state => {
  return {
    invoices: selector(state, "reports.invoices", {}),
    customers: selector(state, "customer.list.list_data", []),
  }
}

export default withRouter(connect(mapStateToProps)(Index))
