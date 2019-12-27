import React from 'react';
import View from 'views/Driver/Index';
import DriverAction from '../../actions/DriverAction';
import BaseContainer, {selector} from 'containers/BaseContainer';
import {withRouter} from 'react-router-dom'
import {connect} from 'react-redux'
import {I18n} from 'helpers/I18n';

class Index extends BaseContainer {
  constructor(props) {
    super(props)
    this.refTable = null
    this.onFetchData = this.onFetchData.bind(this)
    this.onRefTable = this.onRefTable.bind(this)
    this.onDeleteData = this.onDeleteData.bind(this)
  }

  componentDidUpdate(prevProps) {
    //example for check props change
    /* if(prevProps.x !== this.props.x){
      //props x changed
    } */
  }

  onFetchData(state) {
    this.props.dispatch(DriverAction.fetchAll(state));
  }

  onRefTable(ref) {
    this.refTable = ref
  }

  onDeleteData(selectedIds) {
    console.log("selectedIds", selectedIds)
    this.props.dispatch(DriverAction.delete({
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

  render() {
    return (<View
      onFetchData={this.onFetchData}
      onRefTable={this.onRefTable}
      onDeleteData={this.onDeleteData}
      drivers={this.props.drivers} // lấy data từ store, truyền từ container xuống view
      {...this.props}
    />);
  }
}

const mapStateToProps = state => {
  return {
    drivers: selector(state, "driver.list", {}),
  }
}

export default withRouter(connect(mapStateToProps)(Index))
