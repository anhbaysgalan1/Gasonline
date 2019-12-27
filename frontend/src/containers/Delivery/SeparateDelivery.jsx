import React from 'react';
import {connect} from 'react-redux';
import {withRouter} from 'react-router-dom';
import OrderAction from 'actions/OrderAction';
import HistoryAction from 'actions/HistoryAction';
import BaseContainer, {selector} from 'containers/BaseContainer';
import View from 'views/Delivery/Create';
import {pouredFuelTypes} from "config/constant";
import {I18n} from 'helpers/I18n';

class Create extends BaseContainer {
  constructor(props) {
    super(props);
    this.id = this.props.match.params.id;
    this.historyType = pouredFuelTypes.export;
    this.typeExport = "separate";
    this.onSubmit = this.onSubmit.bind(this);
    this.previous = this.previous.bind(this);
  }

  componentDidMount() {
    this.props.dispatch(OrderAction.fetch({id: this.id}))
  }

  previous() {
    this.goto(`/delivery/${this.id}`)
  }

  onSubmit(values) {
    console.log(values)
    if (values.details.every(item => item.quantity === 0)) {
      return this.notify(I18n.t('Validate.emptyFuelsExport'), 'error');
    }
    this.handleSubmit(values)
  }

  handleSubmit(values) {
    const inputs = {...values, orderId: this.id, type: this.historyType};
    this.props.dispatch(HistoryAction.create(inputs))
      .then(data => {
        if (!data.error) {
          this.notify(data.message)
          this.previous()
        } else {
          this.notify(`Response: [${data.error.status}] ${data.error.message}`, 'error')
        }
      })
  }

  render() {
    return (
      <View
        onSubmit={this.onSubmit}
        previous={this.previous}
        typeExport={this.typeExport}
        {...this.props}
      />
    );
  }
}

const mapStateToProps = state => {
  return {
    order: selector(state, "order.item", {}),
  }
}

export default withRouter(connect(mapStateToProps)(Create))
