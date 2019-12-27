import React from 'react';
import {connect} from 'react-redux';
import {withRouter} from 'react-router-dom';
import DeliveryAction from 'actions/DeliveryAction';
import BaseContainer, {selector} from 'containers/BaseContainer';
import View from 'views/Delivery/Index';

class Index extends BaseContainer {
  constructor(props) {
    super(props)
    this.refTable = null
    this.onFetchData = this.onFetchData.bind(this)
    this.onRefTable = this.onRefTable.bind(this)
  }

  componentDidUpdate(prevProps){
    //example for check props change
    /* if(prevProps.x !== this.props.x){
      //props x changed
    } */
  }
 
  onFetchData(state = {}) {
    this.props.dispatch(DeliveryAction.fetchForMe(state))
  }

  componentDidMount(){
    this.onFetchData()
  }

  onRefTable(ref){
    this.refTable = ref
  }

  render() {
    return (
      <View
        onFetchData={this.onFetchData}
        onRefTable ={ this.onRefTable}
        orders={this.props.orders}
      />
    )
  }
}

const mapStateToProps = state => {
  return {
    orders: selector(state, "delivery.list", []),
  }
}

export default withRouter(connect(mapStateToProps)(Index))
