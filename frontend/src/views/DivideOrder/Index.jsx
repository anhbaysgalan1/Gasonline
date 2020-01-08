import React from 'react';
import PropTypes from 'prop-types';
import withStyles from '@material-ui/core/styles/withStyles';
import withWidth, {isWidthUp} from '@material-ui/core/withWidth';
import {withRouter} from 'react-router-dom'
import {Grid} from '@material-ui/core'
import BaseView from 'views/BaseView'
import PaperFade from 'components/Main/PaperFade';
import DateTimeField from 'components/Forms/DateTimeField';
import OrdersPopup from './components/OrdersPopup';
import ConfirmDialog from './components/ConfirmDialog';
import Card from './components/Card';
import {dateFormatBackend, formatDateField} from "config/constant";
import {I18n} from 'helpers/I18n';
import Utils from 'helpers/utility';
import moment from 'moment';

moment.defaultFormat = formatDateField;

const styles = theme => ({});

class Index extends BaseView {
  constructor(props) {
    super(props)
    this.state = {
      truck: {},
      params: null,
      date: new Date(),
      invalidFuels: [],
      isShowPopup: false
    }

    this.OrdersPopup = null;
    this.ConfirmDialog = null;
    this.showOrdersPopup = this.showOrdersPopup.bind(this);
    this.hideOrderPopup = this.hideOrderPopup.bind(this);
    this.showConfirmDialog = this.showConfirmDialog.bind(this);
    this.renderOrdersPopup = this.renderOrdersPopup.bind(this);
    this.renderConfirmDialog = this.renderConfirmDialog.bind(this);
    this.onCompleteSubmit = this.onCompleteSubmit.bind(this);
    this.onChangeDate = this.onChangeDate.bind(this);
    this.onCheckInvalidFuels = this.onCheckInvalidFuels.bind(this);
  }

  componentDidMount() {
    let params = this.getData(this.props, "location.params", null);
    if (params) {
      this.setState({
        params: params,
        date: new Date(params.deliveryDate)
      })
      this.props.loadData(moment(new Date(params.deliveryDate)).format(dateFormatBackend))
      this.props.onNotifyHaveParams(params.id);
    }
  }

  onCompleteSubmit() {
    this.setState({params: null});
  }

  onChangeDate(value) {
    this.props.loadData(moment(value).format(dateFormatBackend))
    this.setState({date: value});
  }

  onCheckInvalidFuels(invalidFuels) {
    this.setState({invalidFuels: invalidFuels})
  }

  //---CONFIRM DIALOG---
  renderConfirmDialog(invalidFuels) {
    return <ConfirmDialog
      title="Không đủ nhiên liệu"
      content={this.setInvalidDialogContent(invalidFuels)}
      ref={(ref) => this.ConfirmDialog = ref}
      isShowPopup={this.state.isShowPopup}
      onSubmit={this.props.onSubmit}
      onCompleteSubmit={this.onCompleteSubmit}
      hideOrderPopup={this.hideOrderPopup}
    />
  }

  showConfirmDialog(truck, selectedIds) {
    this.ConfirmDialog.show(truck, selectedIds)
  }

  setInvalidDialogContent(invalidFuels) {
    invalidFuels = invalidFuels.map(item => I18n.t(`Label.products.${item.name}`));
    let name = invalidFuels.join(", "); // space giữa các tên
    let message = I18n.t('Message.divideOrder.invalidFuelsDialogContent', name);
    try {
      eval(`message=\`${message}\``)
    } catch (e) {
      console.error("can not build message for onNotifyHaveParams function.")
    }
    return message;
  }

  //---ORDERS POPUP---
  renderOrdersPopup(orders, truck, date) {
    let _orders = Utils.filterUndividedOrders(orders);
    let _date = moment(date).format();
    let {width, onRefTable, onSubmit, onCancelSelected, validateBeforeSubmit} = this.props;
    let fullScreen = !isWidthUp('md', width);

    return <OrdersPopup
      date={_date}
      fullScreen={fullScreen}
      maxWidth={width}
      orders={_orders}
      truck={truck}
      ref={(ref) => this.OrdersPopup = ref}
      onRefTable={onRefTable}
      onSubmit={onSubmit}
      onCompleteSubmit={this.onCompleteSubmit}
      onCheckInvalidFuels={this.onCheckInvalidFuels}
      showConfirmDialog={this.showConfirmDialog}
      onCancelSelected={onCancelSelected}
      validateBeforeSubmit={validateBeforeSubmit}
    />
  }

  showOrdersPopup(truck) {
    this.setState({isShowPopup: true})
    this.OrdersPopup.show(truck);
  }

  hideOrderPopup() {
    this.setState({isShowPopup: false})
    this.OrdersPopup.hide();
  }

  render() {
    const {date, invalidFuels, params, truck} = this.state;
    let {orders, trucks, submitOrderSort} = this.props;
    return (
      <PaperFade showLoading={true}>
        <Grid container spacing={4}>
          <Grid item xs={12} lg={12}>
            <DateTimeField
              // fullWidth
              label={I18n.t(`Input.order.deliveryDate`)}
              name="deliveryDate"
              format={formatDateField}
              showTime={false}
              autoOk={true}
              onChange={this.onChangeDate}
              value={date}
              InputProps={{
                readOnly: true
              }}
            />
          </Grid>
          {
            trucks.map((truck) => {
              let _orders = Utils.filterDividedOrdersByTruck(orders, truck);
              return (
                <Grid item xs={12} md={6} lg={4} xl={3} key={truck._id}>
                  <Card
                    orders={_orders}
                    truck={truck}
                    params={params}
                    submitOrderSort={submitOrderSort}
                    onSubmit={this.props.onSubmit}
                    showOrdersPopup={this.showOrdersPopup}
                    showConfirmDialog={this.showConfirmDialog}
                    onCompleteSubmit={this.onCompleteSubmit}
                    onCheckInvalidFuels={this.onCheckInvalidFuels}
                  />
                </Grid>
              )
            })
          }
        </Grid>
        {this.renderOrdersPopup(orders, truck, date)}
        {this.renderConfirmDialog(invalidFuels)}
      </PaperFade>
    )
  }
}

Index.propTypes = {
  classes: PropTypes.object.isRequired,
};

export default withWidth()(withStyles(styles)(withRouter(Index)));
