import React from 'react';
import View from 'views/Staff/Salary'
import StaffAction from '../../actions/StaffAction';
import BaseContainer, { selector } from 'containers/BaseContainer';
import { withRouter } from 'react-router-dom'
import { connect } from 'react-redux'
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
    let ids = this.props.match.params.ids.split(",")
    this.props.dispatch(StaffAction.salary({
      ids: ids,
      startDate: values.date.startDate,
      endDate: values.date.endDate
    }))
  }
  render() {
    return (
      <View
        onSubmit={this.onSubmit}
        data = {this.props.data}
      />
    );
  }
}

const mapStateToProps = state => {
  return {
    //sử dụng selector để lấy state từ redux
    data: selector(state, "staff.salary", []),
  }
}

export default withRouter(connect(mapStateToProps)(Create))