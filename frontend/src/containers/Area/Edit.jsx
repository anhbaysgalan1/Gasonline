import React from 'react';
import {withRouter} from 'react-router-dom';
import {connect} from 'react-redux';
import AreaAction from '../../actions/AreaAction';
import BaseContainer, {selector} from 'containers/BaseContainer';
import View from 'views/Area/Edit';
import {I18n} from 'helpers/I18n';

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
    this.props.dispatch(AreaAction.fetch({_id: this.id}))
  }

  onSubmit(values) {
    this.props.dispatch(AreaAction.edit({
        _id: this.id,
        ...values
      }))
      .then(data => {
        if (!data.error) {
          this.notify(I18n.t('Message.success.update'))
          this.goto("/areas")
        } else {
          this.notify(`Response: [${data.error.status}] ${data.error.message}`, 'error')
        }
      })
  }

  render() {
    return (
      <View
        {...this.props}
        onSubmit={this.onSubmit}
      />
    );
  }
}

const mapStateToProps = state => {
  return {
    //sử dụng selector để lấy state từ redux
    area: selector(state, "area.item", {})
  }
}

export default withRouter(connect(mapStateToProps)(Edit))
