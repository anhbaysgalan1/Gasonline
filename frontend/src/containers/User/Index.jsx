import React from 'react';
import View from 'views/User/Index'
import UserAction from '../../actions/UserAction';
import BaseContainer, { selector } from 'containers/BaseContainer';
import { withRouter } from 'react-router-dom'
import { connect } from 'react-redux'
import { I18n } from 'helpers/I18n';

class Index extends BaseContainer {
  constructor(props) {
    super(props)
    this.refTable = null
    this.onFetchData = this.onFetchData.bind(this)
    this.onRefTable = this.onRefTable.bind(this)
    this.onDeleteData = this.onDeleteData.bind(this)
  }

  onRefTable(ref){
    this.refTable = ref
  }

  onFetchData(state) {
    this.props.dispatch(UserAction.fetchAll(state))
  }

  onDeleteData(selectedIds){
    this.props.dispatch(UserAction.delete({
      ids: selectedIds
    }))
    .then(result => {
      if(!result.error){
        //success
        this.notify(I18n.t('Message.success.delete'))
        if(this.refTable) {
          this.refTable.onSelectionChange([])
          this.refTable.onFetchData()
        }
      }
      else{
        //error
        this.notify(`Response: [${result.error.status}] ${result.error.message}`, 'error')
      }
    })
  }
  render() {
    return (<View
      onRefTable ={ this.onRefTable}
      onFetchData={this.onFetchData}
      data={this.props.data}
      onDeleteData = {this.onDeleteData}
    />);
  }
}


const mapStateToProps = state => {
  return {
    data: selector(state, "user.list", {}),
  }
}

export default withRouter(connect(mapStateToProps)(Index))
