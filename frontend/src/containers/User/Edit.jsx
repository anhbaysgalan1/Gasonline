import React from 'react';
import View from 'views/User/Edit'
import UserAction from '../../actions/UserAction';
import GroupAction from '../../actions/GroupAction';
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
    this.props.dispatch(UserAction.fetch({ _id: this.id }))
    this.props.dispatch(GroupAction.fetchAll({pageSize: -1}))
  }

  onSubmit(values) {
    this.props.dispatch(UserAction.edit({
      _id: this.id,
      ...values
    }))
    .then(data =>{
      if(!data.error){
        this.notify(I18n.t('Message.success.update'))
        this.goto("/users")
      }
      else{
        this.notify(`Response: [${data.error.status}] ${data.error.message}`, 'error')
      }
    })
  }
  loadParent = async (value) => {
    let result = await this.props.dispatch(UserAction.fetchAll({ size: -1 }))
    return this.getData(result, "data.data")
  }

  render() {
    return (
      <View
        data={this.props.data}
        onSubmit={this.onSubmit}
        loadParent={this.loadParent}
        {...this.props}
      />
    );
  }
}

const mapStateToProps = state => {
  return {
    //sử dụng selector để lấy state từ redux
    data: selector(state, "user.item", {}),
    groups: selector(state, "group.list.data", []),
  }
}

export default withRouter(connect(mapStateToProps)(Edit))
