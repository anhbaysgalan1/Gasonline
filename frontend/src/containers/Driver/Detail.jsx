import React from 'react';
import View from 'views/Driver/Detail'
import DriverAction from '../../actions/DriverAction';
import BaseContainer, {selector} from 'containers/BaseContainer';
import {withRouter} from 'react-router-dom'
import {connect} from 'react-redux'

class Detail extends BaseContainer {
  constructor(props) {
    super(props);
  }

  componentDidMount() {
    this.id = this.props.match.params.id;
    this.props.dispatch(DriverAction.fetch({id: this.id}))
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
    driver: selector(state, "driver.item", {}),
  }
}

export default withRouter(connect(mapStateToProps)(Detail))
