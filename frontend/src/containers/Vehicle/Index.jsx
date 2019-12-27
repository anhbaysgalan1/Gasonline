import React from 'react';
import View from 'views/Vehicle/Index'
import VehicleAction from '../../actions/VehicleAction';
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
    //  if(prevProps.drivers.data !== this.props.drivers.data){
    //   this.props.drivers.data = prevProps.drivers.data;
    // } 
  }

  onFetchData(state) {
    this.props.dispatch(VehicleAction.fetchAll(state));
    this.props.dispatch(DriverAction.fetchAll({pageSize: -1}));
  }

  onRefTable(ref) {
    this.refTable = ref
  }

  onDeleteData(selectedIds) {
    this.props.dispatch(VehicleAction.delete({
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
      {...this.props}
    />);
  }
}

const mapStateToProps = state => {
  return {
    vehicles: selector(state, "vehicle.list", {}),
    drivers: selector(state, "driver.list.list_data", []),
  }
}

export default withRouter(connect(mapStateToProps)(Index))
