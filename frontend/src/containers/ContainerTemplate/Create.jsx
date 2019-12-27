import React from 'react';
import View from 'views/__DIRVIEWNAME__/Create'
import __ACTIONNAME__ from '../../actions/__ACTIONNAME__';
import BaseContainer, {selector} from 'containers/BaseContainer';
import {withRouter} from 'react-router-dom'
import {connect} from 'react-redux'
import {I18n} from 'helpers/I18n';

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
    this.props.dispatch(__ACTIONNAME__.create(values))
      .then(data => {
        if (!data.error) {
          this.notify(I18n.t('Message.success.create'))
          this.goto("/__URLNAME__")
        } else {
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
    data: selector(state, "__REDUXNAME__.data", {}),
  }
}

export default withRouter(connect(mapStateToProps)(Create))
