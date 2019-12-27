import React from 'react';
import {Button, Dialog, DialogActions, DialogContent, DialogTitle, Grid} from '@material-ui/core';
import withStyles from '@material-ui/core/styles/withStyles';
import PropTypes from 'prop-types';
import {BaseView} from 'views/BaseView';
import OrdersTable from './OrdersTable';
import RemainingFuelList from './RemainingFuelList';
// import Utils from 'helpers/utility';
import {I18n} from 'helpers/I18n';

const styles = theme => ({
  paper: {
    overflowY: "inherit !important"
  },
  footer: {
    margin: `${theme.spacing(1)}px`,
    paddingLeft: `${theme.spacing(2)}px`,
    textAlign: 'right'

  },
  tableFooter: {
    paddingLeft: `${theme.spacing(1)}px`,
  },
  button: {
    marginLeft: '5px'
    
  }
});

class OrdersPopup extends BaseView {
  constructor() {
    super()
    this.state = {
      open: false,
      truck: null,
    };
    this.selectedIds = [];
    this.onCancel = this.onCancel.bind(this)
    this.onSubmit = this.onSubmit.bind(this)
    this.onSelectOrder = this.onSelectOrder.bind(this)
  }

  show(truck = null) {
    this.setState({
      open: true,
      truck: truck
    })
  }

  hide() {
    this.setState({
      open: false,
      truck: null
    })
  }

  onCancel() {
    const {onCancel} = this.props
    this.hide();
    this.props.onCancelSelected();
    if (typeof onCancel === "function") {
      onCancel(this.state.data)
    }
  }

  onSubmit() {
    if (!this.selectedIds.length) {
      let {validateBeforeSubmit} = this.props;
      this.hide()
      validateBeforeSubmit('No orders selected')
      return
    }

    const {onSubmit, orders, date} = this.props;
    const {truck} = this.state;
    onSubmit({
      driver: truck.driver._id,
      ids: this.selectedIds,
      date
    });
    this.props.onCompleteSubmit();
    this.hide()

    // const selectedItems = orders.filter(item => this.selectedIds.includes(item._id));
    // const dividedByTruckOrders = Utils.filterDividedOrdersByTruck(orders, truck);
    // const amountFuelSelected = Utils.getSumOfEachFuel(selectedItems);
    // const amountFuelDivided = Utils.getSumOfEachFuel(dividedByTruckOrders);
    //
    // /* Check invalid fuels of truck
    //  nếu fuel dự kiến giao > 0 thì check validate */
    // let invalidFuels = [];
    // let remainingFuels = this.getData(truck, 'remain', {});
    // for (let fuel in remainingFuels) {
    //   if (amountFuelSelected[fuel]) {
    //     let value = Number(remainingFuels[fuel]);
    //     let valueDivided = amountFuelDivided[fuel] || 0;
    //     if (value < (valueDivided + amountFuelSelected[fuel])) invalidFuels.push({name: fuel, quantity: value})
    //   }
    // }
    // //show Dialog
    // if (invalidFuels.length) {
    //   this.props.onCheckInvalidFuels(invalidFuels);
    //   this.props.showConfirmDialog(truck, this.selectedIds);
    // } else { //or submit
    //   onSubmit({
    //     driver: truck.driver._id,
    //     ids: this.selectedIds,
    //     date
    //   });
    //   this.props.onCompleteSubmit();
    //   this.hide()
    // }
  }

  onSelectOrder(selectedIds) {
    this.selectedIds = selectedIds;
  }

  renderOrdersTable(orders) {
    return <OrdersTable
      orders={orders}
      onSelectOrder={this.onSelectOrder}
      onRefTable={this.props.onRefTable}/>
  }

  renderRemainingFuelList = (truck) => {
    return (
      <RemainingFuelList truck={truck} styleList={{display: "flex", "marginTop": "-23px"}}/>
    )
  }

  render() {
    let {date, textCancel, textSubmit, classes, orders, fullScreen, maxWidth} = this.props;
    const {truck} = this.state;
    let title = I18n.t('Label.ordersNotDivided') + ": " + date
    textCancel = textCancel || I18n.t("Button.cancel")
    textSubmit = textSubmit || I18n.t("Button.ok")

    return (
      <Dialog
        open={this.state.open}
        onClose={this.onCancel}
        fullWidth={true}
        maxWidth={maxWidth}
        fullScreen={fullScreen}
        aria-labelledby="alert-dialog-title"
        aria-describedby="alert-dialog-description"
        classes={{
          paper: classes.paper
        }}
      >
        <DialogTitle id="alert-dialog-title">
          <Grid container>
            <Grid item xs={4} md={4}>
              {I18n.t("Label.actualRemainingFuel")}
            </Grid>

            <Grid item xs={8} md={8}>
              {this.renderRemainingFuelList(truck)}
            </Grid>

            <Grid item xs={12} md={12}>
              {title}
            </Grid>
          </Grid>
        </DialogTitle>

        <DialogContent id="alert-dialog-description">
          {this.renderOrdersTable(orders)}
        </DialogContent>

        <DialogActions className={classes.footer}>
          <Grid container direction='row' justify="flex-end" alignItems="flex-end">
            <Grid item xs={12} md={12} >
              <Button onClick={this.onSubmit} color="primary" autoFocus>
                {textSubmit}
              </Button>
              <Button onClick={this.onCancel}  color="primary" className={classes.button}>
                {textCancel}
              </Button>
            </Grid>
          </Grid>
        </DialogActions>
      </Dialog>
    );
  }
}

OrdersPopup.propTypes = {
  classes: PropTypes.object.isRequired,
};

export default withStyles(styles)(OrdersPopup);
