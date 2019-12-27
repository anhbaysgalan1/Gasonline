import React from 'react';
import {withRouter} from 'react-router-dom'
import {connect} from 'react-redux';
import CustomerAction from '../../actions/CustomerAction';
import BaseContainer, {selector} from 'containers/BaseContainer';
import View from 'views/Customer/Detail';

class Detail extends BaseContainer {
  constructor(props) {
    super(props)
  }

  componentDidMount() {
    this.id = this.props.match.params.id
    this.props.dispatch(CustomerAction.fetch({id: this.id}))
  }

  render() {
    return (
      <View
        customer={this.props.customer}
        {...this.props}
      />
    );
  }
}

const mapStateToProps = state => {
  return {
    customer: selector(state, "customer.item", {}),
  }
}

export default withRouter(connect(mapStateToProps)(Detail))
