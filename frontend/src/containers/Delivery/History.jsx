import React from 'react';
import {connect} from 'react-redux';
import {withRouter} from 'react-router-dom';
import OrderAction from 'actions/OrderAction';
import BaseContainer, {selector} from 'containers/BaseContainer';
import View from 'views/Delivery/History';

class Create extends BaseContainer {
  constructor(props) {
    super(props);
    this.id = this.props.match.params.id;
    this.previous = this.previous.bind(this);
    this.generalDelivery = this.generalDelivery.bind(this);
    this.separateDelivery = this.separateDelivery.bind(this);
  }

  componentDidMount() {
    this.props.dispatch(OrderAction.fetch({id: this.id}))
  }

  previous() {
    this.goto(`/delivery`)
  }

  generalDelivery() {
    this.goto(`/delivery/${this.id}/general`)
  }

  separateDelivery() {
    this.goto(`/delivery/${this.id}/separate`)
  }

  render() {
    return (
      <View
        previous={this.previous}
        generalDelivery={this.generalDelivery}
        separateDelivery={this.separateDelivery}
        {...this.props}
      />
    );
  }
}

const mapStateToProps = state => {
  return {
    order: selector(state, "order.item", {}),
  }
}

export default withRouter(connect(mapStateToProps)(Create))
