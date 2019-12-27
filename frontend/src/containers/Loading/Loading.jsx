import React from 'react';
import BaseContainer, {selector} from 'containers/BaseContainer';
import Loading from 'components/Progress/Loading'
import {withRouter} from 'react-router-dom'
import {connect} from 'react-redux'

class LoadingContainer extends BaseContainer {
  render() {
    return <Loading show={this.props.isLoading}/>
  }
}

const mapStateToProps = state => {
  return {
    isLoading: selector(state, "loading", false),
  }
}

const mapDispatchToProps = (dispatch, props) => {
  return {}
}

export default withRouter(connect(mapStateToProps, mapDispatchToProps)(LoadingContainer))
