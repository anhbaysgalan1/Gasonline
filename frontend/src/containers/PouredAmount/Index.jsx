import React from 'react';
import {connect} from 'react-redux';
import {withRouter} from 'react-router-dom';
import HistoryAction from 'actions/HistoryAction';
import BaseContainer, {selector} from 'containers/BaseContainer';
import View from 'views/PouredAmount/Index';
import {pouredFuelTypes} from "config/constant";
import {I18n} from 'helpers/I18n';

class Index extends BaseContainer {
  constructor(props) {
    super(props);
    this.historyType = pouredFuelTypes.import;
    this.onSubmit = this.onSubmit.bind(this);
    this.onFetchData = this.onFetchData.bind(this);
  }

  componentDidMount() {
    this.onFetchData()
  }

  onFetchData(date) {
    let filters = {type: this.historyType, date: date || undefined};
    this.props.dispatch(HistoryAction.fetchAll(filters))
  }

  onSubmit(values) {
    if (values.every(item => item.quantity === 0)) {
      return this.notify(I18n.t('Validate.emptyFuelsImport'), 'error');
    }
    this.handleSubmit(values)
  }

  handleSubmit(values) {
    const inputs = {details: values, type: this.historyType};
    this.props.dispatch(HistoryAction.create(inputs))
      .then(data => {
        if (!data.error) {
          this.notify(data.message)
          this.goto("/poured-amount")
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
        {...this.props}
      />
    );
  }
}

const mapStateToProps = state => {
  return {
    histories: selector(state, "history.list", []),
  }
}

export default withRouter(connect(mapStateToProps)(Index))
