import React from 'react';
import View from 'views/Role/Edit'
import RoleAction from '../../actions/RoleAction';
import BaseContainer, { selector } from 'containers/BaseContainer';
import { withRouter } from 'react-router-dom'
import { connect } from 'react-redux'
import { I18n } from 'helpers/I18n';
import PermissionAction from '../../actions/PermissionAction';

/**
 * Files are automatically generated from the template.
 * MQ Solutions 2019
 */
class Edit extends BaseContainer {
  constructor(props) {
    super(props)
    this.onSubmit = this.onSubmit.bind(this)
  }

  componentDidMount() {
    this.props.dispatch(PermissionAction.fetchAll())
    this.id = this.props.match.params.id
    this.props.dispatch(RoleAction.fetch({ _id: this.id }))
  }

  componentWillReceiveProps(nextProps) {

    this.handleDataAction(RoleAction, "edit", nextProps,{
        success: (data) => {
          this.notify(I18n.t('Message.success.update'))
          this.goto("/roles")
        },
        error: (error) => {
          this.notify(`Response: [${error.status}] ${error.message}`, 'error')
        },
    })
  }

  onSubmit(values) {
    this.props.dispatch(RoleAction.edit({
      _id: this.id,
      ...values
    }))
  }

  render() {
    return (
      <View
        data={this.props.data}
        permission={this.props.permission}
        onSubmit={this.onSubmit}
      />
    );
  }
}

const mapStateToProps = state => {
  return {
    //sử dụng selector để lấy state từ redux
    lastType: selector(state, "role.lastType", {}),
    error: selector(state, "role.error", ""),
    data: selector(state, "role.item", {}),
    permission: selector(state, "permission.list.data", []),
  }
}

export default withRouter(connect(mapStateToProps)(Edit))
