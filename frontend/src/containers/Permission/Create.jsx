import React from 'react';
import View from 'views/Permission/Create'
import PermissionAction from '../../actions/PermissionAction';
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

  componentWillReceiveProps(nextProps){
    this.handleDataAction(PermissionAction, "create", nextProps,{
      success: (data) => {
        this.notify(I18n.t('Message.success.create'))
        this.goto("/permissions")
      },
      error: (error) => {
        this.notify(`Response: [${error.status}] ${error.message}`, 'error')
      },
    })
  }

  onSubmit(values) {
    this.props.dispatch(PermissionAction.create(values))
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
    lastType: selector(state, "permission.lastType", {}),
    error: selector(state, "permission.error", ""),
    data: selector(state, "permission.data", {}),
  }
}

export default withRouter(connect(mapStateToProps)(Create))
