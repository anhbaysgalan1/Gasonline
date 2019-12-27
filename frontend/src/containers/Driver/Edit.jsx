import React from 'react';
import View from 'views/Driver/Edit'
import DriverAction from '../../actions/DriverAction';
import BaseContainer, {selector} from 'containers/BaseContainer';
import {withRouter} from 'react-router-dom'
import {connect} from 'react-redux'
import {I18n} from 'helpers/I18n';

class Edit extends BaseContainer {
  constructor(props) {
    super(props);
    this.onSubmit = this.onSubmit.bind(this);
  }

  componentDidMount() {
    this.id = this.props.match.params.id;
    this.props.dispatch(DriverAction.fetch({id: this.id}))
  }

  onSubmit(values) {
    console.log("values on submit", values)
    debugger
    this.props.dispatch(DriverAction.edit({
        id: this.id,
        ...values
      }))
      .then(data => {
        console.log("data on submit", data)
        if (!data.error) {
          this.notify(I18n.t('Message.success.update'))
          this.goto("/drivers")
        } else {
          this.notify(`Response: [${data.error.status}] ${data.error.message}`, 'error')
        }
      })
  }

  render() {
    return (
      <View
        onSubmit={this.onSubmit}
        {...this.props}
      />
    );
  }
}

const mapStateToProps = state => {
  return {
    driver: selector(state, "driver.item", {}),
  }
}

export default withRouter(connect(mapStateToProps)(Edit))
