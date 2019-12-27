import React from 'react';
import View from 'views/Vehicle/Create'
import DriverAction from '../../actions/DriverAction';
import VehicleAction from '../../actions/VehicleAction';
import BaseContainer, {selector} from 'containers/BaseContainer';
import {withRouter} from 'react-router-dom'
import {connect} from 'react-redux'
import {I18n} from 'helpers/I18n';

class Create extends BaseContainer {
  constructor(props) {
    super(props);
    this.onSubmit = this.onSubmit.bind(this)
  }

  componentDidMount() {
    this.props.dispatch(DriverAction.fetchAll({pageSize: -1}))
  }

  formatData = (values) => {
    if (Array.isArray(values.remaining)) {
      values.remaining.map(item => {
        if (!item.quantity) {
          item.quantity = 0;
        }
      })
    }
  }

  onSubmit(values) {
    let isError = false
    for (let fuelType in values.capacity) {
      let fuelTypeCapacity = values.capacity[fuelType]
      let fuelTypeRemain = values.remain[fuelType] || 0
      if (fuelTypeCapacity < fuelTypeRemain) {
        isError = true
      }
      if (!values.remain[fuelType]) {
        values.remain[fuelType] = 0
      }
    }
    if (isError) {
      this.notify(I18n.t('Validate.editFuelsTruck'), 'error')
    } else {
      this.submitVehicle(values);
    }
  }

  submitVehicle(values) {
    this.props.dispatch(VehicleAction.create(values))
      .then(data => {
        if (!data.error) {
          this.notify(I18n.t('Message.success.create'))
          this.goto("/vehicles")
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
    data: selector(state, "vehicle.data", {}),
    drivers: selector(state, "driver.list.list_data", []),
  }
}

export default withRouter(connect(mapStateToProps)(Create))
