import React from 'react';
import View from 'views/Vehicle/Edit'
import VehicleAction from '../../actions/VehicleAction';
import DriverAction from '../../actions/DriverAction';
import BaseContainer, {selector} from 'containers/BaseContainer';
import {withRouter} from 'react-router-dom'
import {connect} from 'react-redux'
import {I18n} from 'helpers/I18n';

class Edit extends BaseContainer {
  constructor(props) {
    super(props)
    this.onSubmit = this.onSubmit.bind(this)
  }

  componentDidMount() {
    this.id = this.props.match.params.id;
    this.props.dispatch(VehicleAction.fetch({id: this.id}))
    this.props.dispatch(DriverAction.fetchAll({pageSize: -1}));
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

  submitVehicle(values) {
    this.props.dispatch(VehicleAction.edit({
        id: this.id,
        ...values
      }))
      .then(data => {
        if (!data.error) {
          this.notify(I18n.t('Message.success.update'))
          this.goto("/vehicles")
        } else {
          this.notify(`Response: [${data.error.status}] ${data.error.message}`, 'error')
        }
      })
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

  render() {
    return (
      <View
        {...this.props}
        onSubmit={this.onSubmit}
      />
    );
  }
}

const mapStateToProps = state => {
  return {
    vehicle: selector(state, "vehicle.item", {}),
    drivers: selector(state, "driver.list.list_data", []),
  }
}

export default withRouter(connect(mapStateToProps)(Edit))
