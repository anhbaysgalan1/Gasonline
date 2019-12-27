import React from 'react';
import View from 'views/User/Create'
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
class Create extends BaseContainer {
  constructor(props) {
    super(props)
    this.onSubmit = this.onSubmit.bind(this)
  }

  componentDidMount(){
    this.props.dispatch(GroupAction.fetchAll({pageSize: -1}))
  }
  onSubmit(values) {
    this.props.dispatch(UserAction.create(values))
    .then(data =>{
      if(!data.error){
        this.notify(I18n.t('Message.success.create'))
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
        onSubmit={this.onSubmit}
        loadParent = {this.loadParent}
        {...this.props}
      />
    );
  }
}

const mapStateToProps = state => {
  return {
    //sử dụng selector để lấy state từ redux
    data: selector(state, "user.data", {}),
    groups: selector(state, "group.list.data", [])
  }
}

export default withRouter(connect(mapStateToProps)(Create))
