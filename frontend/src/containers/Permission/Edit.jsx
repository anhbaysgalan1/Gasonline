import React from 'react';
import View from 'views/Permission/Edit'
import PermissionAction from '../../actions/PermissionAction';
import BaseContainer, { selector } from 'containers/BaseContainer';
import { withRouter } from 'react-router-dom'
import { connect } from 'react-redux'
import { I18n } from 'helpers/I18n';
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
    this.id = this.props.match.params.id
    this.props.dispatch(PermissionAction.fetch({ _id: this.id }))
  }
  componentWillReceiveProps(nextProps) {

    this.handleDataAction(PermissionAction, "edit", nextProps,{
        success: (data) => {
          this.notify(I18n.t('Message.success.update'))
          this.goto("/permissions")
        },
        error: (error) => {
          this.notify(`Response: [${error.status}] ${error.message}`, 'error')
        },
    })
  }

  onSubmit(values) {
    this.props.dispatch(PermissionAction.edit({
      _id: this.id,
      ...values
    }))
  }
  render() {
    return (
      <View
        data={this.props.data}
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
    data: selector(state, "permission.item", {}),
  }
}

export default withRouter(connect(mapStateToProps)(Edit))
