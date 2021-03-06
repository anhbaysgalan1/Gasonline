import React from 'react';
import View from 'views/CustomersOrder/Index'
import ReportAction from '../../actions/ReportAction';
import CustomerAction from '../../actions/CustomerAction'
import BaseContainer, {selector} from 'containers/BaseContainer';
import {withRouter} from 'react-router-dom'
import {connect} from 'react-redux'
import moment from 'moment'
import {saveFile} from 'helpers/File';
import {dateFormatBackend} from 'config/constant';
moment.defaultFormat = dateFormatBackend;

class Index extends BaseContainer {
  constructor(props) {
    super(props)
    this.refTable = null
    this.filters = {}
  }

  componentDidMount(){
    this.onFetchData({})  // clear data table
    this.props.dispatch(CustomerAction.fetchAll({pageSize: -1}))
  }

  getInvoiceDate({startDate, endDate}){
    return {
      startDate: startDate && moment(startDate).format(),
      endDate: endDate && moment(endDate).format()
    }
  }

  onFetchData = (state = {}) => {
    this.invoiceDate = this.getInvoiceDate(state);
    this.filters = state;
    this.props.dispatch(ReportAction.fetchInvoices({
      ...state,
      ...this.invoiceDate
    }))
  }

  loadUser = (filters) => {
    let conditions = [
      {columnName: "type", value: filters['type'], operation: 'equal', "dataType": "number"},
    ]
    this.props.dispatch(CustomerAction.fetchAll({
      filters: conditions,
      pageSize: -1
    }))
  }

  onExportFile = (state) => {
    this.props
      .dispatch(ReportAction.exportInvoices({...state, exportExcel: true}))
      .then(response => {
        let {fullPath, fileName} = this.getData(response, 'data', {});
        
        if(fullPath) {
          saveFile(fullPath, fileName || 'The invoices.xls')
        }
      })
      .catch(error => console.warn('cant export file!!!'))
  }

  onRefTable = (ref) => this.refTable = ref;

  render() {
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
        onExportFile={this.onExportFile}
      />
    );
  }
}

const mapStateToProps = state => {
  return {
    invoices: selector(state, "reports.invoices", {}),
    customers: selector(state, "customer.list.list_data", []),
  }
}

export default withRouter(connect(mapStateToProps)(Index))
