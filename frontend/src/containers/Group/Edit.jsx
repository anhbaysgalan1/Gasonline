import React from 'react';
import View from 'views/Group/Edit'
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
    this.props.dispatch(GroupAction.fetch({ _id: this.id }))
  }

  onSubmit(values) {
    this.props.dispatch(GroupAction.edit({
      _id: this.id,
      ...values
    }))
    .then(data =>{
      if(!data.error){
        this.notify(I18n.t('Message.editGroupSuccess'))
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
        data={this.props.data}
        onSubmit={this.onSubmit}
      />
    );
  }
}

const mapStateToProps = state => {
  return {
    //sử dụng selector để lấy state từ redux
    lastType: selector(state, "group.lastType", {}),
    error: selector(state, "group.error", ""),
    data: selector(state, "group.item", {}),
  }
}

export default withRouter(connect(mapStateToProps)(Edit))