import React from 'react';
import View from 'views/Role/Create'
import RoleAction from '../../actions/RoleAction';
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
    this.state = {
      permission: []
    }
    this.onSubmit = this.onSubmit.bind(this)
  }

  componentWillReceiveProps(nextProps){
  }

  componentDidMount(){
    this.props.dispatch(PermissionAction.fetchAll())
  }

  onSubmit(values) {
    this.props.dispatch(RoleAction.create(values)).then(data => {
      this.notify(I18n.t('Message.success.create'))
      this.goto("/roles")
    })
  }

  render() {
    let {permission} = this.props
    return (
      <View
        onSubmit={this.onSubmit}
        permission={permission}
      />
    );
  }
}

const mapStateToProps = state => {
  return {
    //sử dụng selector để lấy state từ redux
    data: selector(state, "role.data", {}),
    permission: selector(state, "permission.list.data", []),
  }
}

export default withRouter(connect(mapStateToProps)(Create))
