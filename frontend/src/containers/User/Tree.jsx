import React from 'react';
import View from 'views/User/Tree'
import UserAction from '../../actions/UserAction';
import BaseContainer, { selector } from 'containers/BaseContainer';
import { withRouter } from 'react-router-dom'
import { connect } from 'react-redux'

class Index extends BaseContainer {
  constructor(props) {
    super(props)
    this.refTable = null
    this.onRefTable = this.onRefTable.bind(this)
  }

  onRefTable(ref){
    this.refTable = ref
  }

  componentDidMount(state) {
    let id = this.props.match.params.id
    this.props.dispatch(UserAction.fetch({ _id: id }))
    this.props.dispatch(UserAction.getTree({_id: id}))
  }

  render() {
    return (<View
      onRefTable ={ this.onRefTable}
      onFetchData={() => {}}
      data={this.props.data}
      user={this.props.user}
    />);
  }
}


const mapStateToProps = state => {
  return {
    user:selector(state,"user.item", {}),
    data: selector(state, "user.tree", []),
  }
}

export default withRouter(connect(mapStateToProps)(Index))