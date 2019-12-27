import React from 'react';
import View from 'views/Report/Index'
// import CustomerAction from '../../actions/CustomerAction';
// import GroupAction from '../../actions/GroupAction';
import ReportAction from '../../actions/ReportAction';

import BaseContainer, {selector} from 'containers/BaseContainer';
import {withRouter} from 'react-router-dom'
import {connect} from 'react-redux'
// import {I18n} from 'helpers/I18n';
import moment from 'moment';
import axios from 'axios'

class Index extends BaseContainer {
  constructor(props) {
    super(props)
    this.onSubmit = this.onSubmit.bind(this)
  }

  componentDidMount() {
  }

  onSubmit(values) {
    let month = moment(values.month).format("MM/YYYY");
    values = {...values, month: month};
    console.log("values", values)
    // const {rePassword, ...othervalues} = values;
    debugger
    // this.props.dispatch(CustomerAction.create(othervalues))
    // .then(data =>{
    //   if(!data.error){
    //     this.notify(I18n.t('Message.success.create'))
    //     this.goto("/customers")
    //   }
    //   else{
    //     this.notify(`Response: [${data.error.status}] ${data.error.message}`, 'error')
    //   }
    // })
  }

  viewReport = async (date) => {
    let dateString = moment(date).format("YYYY-MM-DD")
    let url = window.config.API_HOST + `/api/authWithSession?token=${localStorage.getItem("token")}&redirect=/pdf/daily-report-${dateString}.pdf`
    /* let response = await axios({
      url: 'http://localhost:3333/api/reports',
      method: 'GET',
      responseType: 'blob', // important
    }) */
    //const url = window.URL.createObjectURL(new Blob([response.data], {type: 'application/pdf'}));
    window.open(url);
  }

  render() {
    return (
      <View
        onSubmit={this.onSubmit}
        viewReport={this.viewReport}
        {...this.props}
      />
    );
  }
}

const mapStateToProps = state => {
  return {
    // customer: selector(state, "customer.data", {}),
  }
}

export default withRouter(connect(mapStateToProps)(Index))
