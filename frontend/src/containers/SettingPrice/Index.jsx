import React from 'react';
import {connect} from 'react-redux';
import {withRouter} from 'react-router-dom';
import SettingPriceAction from 'actions/SettingPriceAction';
import BaseContainer, {selector} from 'containers/BaseContainer';
import View from 'views/SettingPrice/Index';
import moment from 'moment';

class Index extends BaseContainer {
  constructor(props) {
    super(props)
    this.state = {isEditing: false}
    this.onSubmit = this.onSubmit.bind(this);
    this.onFetchData = this.onFetchData.bind(this);
  }

  componentDidMount() {
    this.props.dispatch(SettingPriceAction.fetch());
  }

  onFetchData(month) {
    this.props.dispatch(SettingPriceAction.fetch({month: month}));
  }

  onChangeStatus(status) {
    this.setState({isEditing: status})
  }

  onSubmit(values) {
    let _values = {...values, month: moment(values.month).format("YYYY-MM")}
    this.props.dispatch(SettingPriceAction.edit(_values))
      .then(data => {
        if (!data.error) {
          this.notify(data.message)
          this.onChangeStatus(false)
        } else {
          this.notify(`Response: [${data.error.status}] ${data.error.message}`, 'error')
        }
      })
  }

  render() {
    return (
      <View
        onSubmit={this.onSubmit}
        onFetchData={this.onFetchData}
        onChangeStatus={(status) => this.onChangeStatus(status)}
        isEditing={this.state.isEditing}
        {...this.props}
      />
    );
  }
}

const mapStateToProps = state => {
  let data = selector(state, "settingPrice.data", {});
  let {insurance, taxes, products, prices} = data;
  return {
    settingPrice: {insurance, taxes, products, prices},
  }
}

export default withRouter(connect(mapStateToProps)(Index))
