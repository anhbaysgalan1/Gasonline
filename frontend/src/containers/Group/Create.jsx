import React from 'react';
import View from 'views/Group/Create'
import GroupAction from '../../actions/GroupAction';
import BaseContainer, { selector } from 'containers/BaseContainer';
import { withRouter } from 'react-router-dom'
import { connect } from 'react-redux'
import { I18n } from 'helpers/I18n';
/**
 * Files are automatically generated from the template.
 * MQ Solutions 2019
 */
class Create extends BaseContainer {
  constructor(props) {
    super(props)
    this.onSubmit = this.onSubmit.bind(this)
  }

  onSubmit(values) {
    this.props.dispatch(GroupAction.create(values))
    .then(data =>{
      if(!data.error){
        this.notify(I18n.t('Message.success.group.create'))
        this.goto("/groups")
      }
      else{
        this.notify(`Response: [${data.error.status}] ${data.error.message}`, 'error')
      }
    })
  }
  render() {
    return (
      <View
        onSubmit={this.onSubmit}
      />
    );
  }
}

const mapStateToProps = state => {
  return {
    //sử dụng selector để lấy state từ redux
    lastType: selector(state, "group.lastType", {}),
    isLoading: selector(state, "group.isLoading", false),
    error: selector(state, "group.error", ""),
    data: selector(state, "group.data", {}),
  }
}

export default withRouter(connect(mapStateToProps)(Create))
