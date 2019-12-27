import React from 'react';
import View from 'views/Order/Detail'
import OrderAction from 'actions/OrderAction';
import BaseContainer, {selector} from 'containers/BaseContainer';
import {withRouter} from 'react-router-dom'
import {connect} from 'react-redux';

class Detail extends BaseContainer {
  constructor(props) {
    super(props)
  }

  componentDidMount() {
    this.id = this.props.match.params.id
    this.props.dispatch(OrderAction.fetch({id: this.id}));
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
    order: selector(state, "order.item", {})
  }
}

export default withRouter(connect(mapStateToProps)(Detail))
