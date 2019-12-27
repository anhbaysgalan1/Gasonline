import React from 'react';
import {connect} from 'react-redux';
import {withRouter} from 'react-router-dom';
import VehicleAction from 'actions/VehicleAction';
import BaseContainer, {selector} from 'containers/BaseContainer';
import View from 'views/RemainingAmount/Index';

class Index extends BaseContainer {
  constructor(props) {
    super(props);
  }

  componentDidMount() {
    this.props.dispatch(VehicleAction.fetchForDriver())
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
  }
}

export default withRouter(connect(mapStateToProps)(Index))
