import React from 'react';
import View from 'views/Vehicle/Detail'
import VehicleAction from '../../actions/VehicleAction';
import DriverAction from '../../actions/DriverAction';
import BaseContainer, {selector} from 'containers/BaseContainer';
import {withRouter} from 'react-router-dom'
import {connect} from 'react-redux';

class Edit extends BaseContainer {
  constructor(props) {
    super(props);
  }

  componentDidMount() {
    this.id = this.props.match.params.id;
    this.props.dispatch(VehicleAction.fetch({id: this.id}))
    this.props.dispatch(DriverAction.fetchAll());
  }

  render() {
    return (
      <View
        {...this.props}
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
