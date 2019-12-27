import React from 'react';
import {connect} from 'react-redux';
import {withRouter} from 'react-router-dom';
import DeliveryAction from 'actions/DeliveryAction';
import BaseContainer, {selector} from 'containers/BaseContainer';
import View from 'views/DeliveryOthers/Index';

class Index extends BaseContainer {
  constructor(props) {
    super(props)
    this.refTable = null
    this.onFetchData = this.onFetchData.bind(this)
    this.onRefTable = this.onRefTable.bind(this)
  }

  componentDidUpdate(prevProps) {
    //example for check props change
    /* if(prevProps.x !== this.props.x){
      //props x changed
    } */
  }

  componentDidMount() {
    this.onFetchData()
  }

  onFetchData(state = {}) {
    this.props.dispatch(DeliveryAction.fetchForOthers(state))
  }

  onRefTable(ref) {
    this.refTable = ref
  }

  render() {
    return (<View
      onFetchData={this.onFetchData}
      onRefTable={this.onRefTable}
      trucks={this.props.orders}
    />);
  }
}

const mapStateToProps = state => {
  return {
    orders: selector(state, "delivery.listOther", []),
  }
}

export default withRouter(connect(mapStateToProps)(Index))
