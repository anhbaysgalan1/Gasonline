import React from 'react';
import {withRouter} from 'react-router-dom';
import {connect} from 'react-redux';
import CustomerAction from '../../actions/CustomerAction';
import BaseContainer, {selector} from 'containers/BaseContainer';
import View from 'views/Customer/Index';
import {I18n} from 'helpers/I18n';

class Index extends BaseContainer {
  constructor(props) {
    super(props)
    this.refTable = null
    this.onFetchData = this.onFetchData.bind(this)
    this.onRefTable = this.onRefTable.bind(this)
    this.onDeleteData = this.onDeleteData.bind(this)
    this.onSubmitData = this.onSubmitData.bind(this)
  }

  componentDidUpdate(prevProps) {
    //example for check props change
    /* if(prevProps.x !== this.props.x){
      //props x changed
    } */
  }

  onFetchData(state) {
    this.props.dispatch(CustomerAction.clearData(state))
    this.props.dispatch(CustomerAction.fetchAll(state))
  }

  onRefTable(ref) {
    this.refTable = ref
  }

  onDeleteData(selectedIds) {
    this.props.dispatch(CustomerAction.delete({
        ids: selectedIds
      }))
      .then(result => {
        if (!result.error) {
          //success
          this.notify(I18n.t('Message.success.delete'))
          if (this.refTable) {
            this.refTable.onSelectionChange([])
            this.refTable.onFetchData()
          }
        } else {
          //error
          this.notify(`Response: [${result.error.status}] ${result.error.message}`, 'error')
        }
      })
  }

  async onSubmitData(listEditing) {
    try {
      if (Array.isArray(listEditing)) {
        let promises = listEditing.map(element => {
          this.props.dispatch(CustomerAction.edit({
            id: element.id,
            ...element
          }))
        })
        await Promise.all(promises)
        this.notify(I18n.t('Message.success.update'))
      }
    } catch (error) {
      console.log('error', error)
      this.notify(`Đã có lỗi xảy ra!`, 'error')
    }
  }

  render() {
    return (<View
      onFetchData={this.onFetchData}
      onRefTable={this.onRefTable}
      onDeleteData={this.onDeleteData}
      onSubmitData={this.onSubmitData}
      customers={this.props.customers}
      {...this.props}
    />);
  }
}

const mapStateToProps = state => {
  return {
    customers: selector(state, "customer.list", {}),
  }
}

export default withRouter(connect(mapStateToProps)(Index))
