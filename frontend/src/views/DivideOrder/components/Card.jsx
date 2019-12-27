import React from 'react'
import PropTypes from 'prop-types'
import withStyles from '@material-ui/core/styles/withStyles'
import 'react-virtualized/styles.css'
import {withRouter} from 'react-router-dom'
import {Badge, Button, Icon, Card as CardView, Fade, Grid, IconButton, Paper, Popper, Tooltip} from '@material-ui/core'
import DoneRoundedIcon from '@material-ui/icons/DoneRounded'
import LocalShippingRoundedIcon from '@material-ui/icons/LocalShippingRounded'
import PopupState, {bindPopper, bindToggle} from 'material-ui-popup-state'
import {BaseView} from 'views/BaseView'
import RemainingFuelList from './RemainingFuelList'
import VirtualizedTable from './VirtualizedTable'
import ReactDnd from './ReactDnd'
import Utils from 'helpers/utility'
import {I18n} from 'helpers/I18n'

const styles = theme => ({
  marginBadge: {
    marginRight: '20px',
    marginBottom: '5px' 
  },
  containerTruckInfo: {
    padding: `${theme.spacing(2)}px ${theme.spacing(3)}px`,
    backgroundColor: theme.palette.primary.main,
    color: theme.palette.title.withDarkBg,
  },
  card: {
    border: "1px rgba(0,0,0,0.12) solid",
  },
  rightBtn: {
    float: "right",
  },
  leftBtn: {
    float: "left",
  },
  centerBtn: {
    position: "relative",
    left: "25%"
  },
  labelBtn: {
    color: theme.palette.title.withDarkBg,
  }
})

class Card extends BaseView {
  constructor(props) {
    super(props)
    this.state = {
      idsOrder: []
    }
  }

  onSubmitParamOrder(dividedByTruckOrders, orders, truck) {
    console.log('onSubmitParamOrder dividedByTruckOrders', dividedByTruckOrders)
    console.log('onSubmitParamOrder orders', orders)
    console.log('onSubmitParamOrder truck', truck)
    const {onSubmit, onCompleteSubmit, showConfirmDialog} = this.props
    let order = orders.find(item => Number(item.id) === Number(this.props.params.id))
    let dividedSum = Utils.getSumOfEachFuel(dividedByTruckOrders)

    /* remaining - selected( đã giao và chưa giao): có thể âm
     nếu fuel dự kiến giao lớn hơn 0 thì check validate */

    let invalidFuels = truck.fuels.filter((item, index) => {
      if (Number(order.fuels[index].expectnum) <= 0) {
        return false
      }
      return Number(order.fuels[index].expectnum) > Number(item.remaining) - dividedSum[index]
    })

    if (invalidFuels.length) {
      this.props.onCheckInvalidFuels(invalidFuels)
      showConfirmDialog(truck, [this.props.params.id])
    } else {
      onSubmit(truck, [this.props.params.id])
      onCompleteSubmit()
    }
  }

  formatData = (orders) => {
    return orders.map((order, index) => {
      return {
        address: this.getData(order, "deliveryAddress", ""),
        customer: this.getData(order, "customer.code", ""),
        index: index + 1,
        action: (
          Number(order.status) === 3
            ?
            <Tooltip title={I18n.t("Tooltip.detail")}>
              <IconButton onClick={() => this.goto(`/orders/detail/${order._id}`)}>
                <DoneRoundedIcon/>
              </IconButton>
            </Tooltip>
            :
            <Tooltip title={I18n.t("Tooltip.detail")}>
              <IconButton onClick={() => this.goto(`/orders/detail/${order._id}`)}>
                <LocalShippingRoundedIcon/>
              </IconButton>
            </Tooltip>
        )
      }
    })
  }

  renderHeaderCard(truck) {
    const {classes} = this.props
    let remainingDiesel = this.getData(truck, 'remain.diesel', 0).toString()
    return (
      <Grid
        container
        direction="row"
        alignItems="center"
        className={classes.containerTruckInfo}
      >
        <Grid item xs={6} lg={6}>
          {truck.driver.code}-{truck.driver.fullName}
        </Grid>
        <Grid item xs={6} lg={6}>
          <PopupState variant="popper" popupId="fuelsPopper"> 
            {popupState => (
              <div className={classes.marginBadge}>
                <Badge 
                  badgeContent={remainingDiesel} 
                  max={1000000000}
                  color="secondary" 
                  className={classes.rightBtn}
                >
                  <Button {...bindToggle(popupState)} size="small" className={classes.labelBtn}>
                    {I18n.t("Button.remaining")}
                  </Button>
                </Badge>

                <Popper {...bindPopper(popupState)} transition>
                  {({TransitionProps}) => (
                    <Fade {...TransitionProps} timeout={350}>
                      <Paper>
                        <RemainingFuelList truck={truck}/>
                      </Paper>
                    </Fade>
                  )}
                </Popper>
              </div>
            )}
          </PopupState>
        </Grid>

        <Grid item xs={6} lg={6}>
          ({truck.licensePlate})
        </Grid>
      </Grid>
    )
  }

  getDataSort = (data = []) => {
    let idsOrder = []
    let userId = null

    data.map(item => {
      idsOrder.push(item._id)
      userId = this.getData(item, 'driver._id', '')
    })
    this.props.submitOrderSort({ userId: userId, idsOrder: idsOrder })
  }

  renderFooterCard(dividedByTruckOrders, orders, truck) {
    const {showOrdersPopup, classes} = this.props
    let userId = this.getData(truck, "driver._id", '')
    let checkDisabled = userId == this.state.userId ? false : true 
    return (
      <div>
        <Grid container justify="center">
          <Grid item xs={6}>
            <Button
              className={this.props.params ? classes.rightBtn : classes.centerBtn}
              size="small"
              color="primary"
              onClick={() => showOrdersPopup(truck)}
            >
              {I18n.t("Button.divide")}
            </Button>
          </Grid>
          {this.props.params ?
            <Grid item xs={6}>
              <Button
                className={classes.leftBtn}
                size="small"
                color="primary"
                variant="contained"
                onClick={() => this.onSubmitParamOrder(dividedByTruckOrders, orders, truck)}
              >
                {I18n.t("Button.confirm")}
              </Button>
            </Grid> : ""
          }
        </Grid>
      </div>
    )
  }

  render() {
    const {classes, orders, truck} = this.props
    let dividedByTruckOrders = Utils.filterDividedOrdersByTruck(orders, truck)
    // let _orders = this.formatData(dividedByTruckOrders)
    return (
      <div> 
        <CardView className={classes.card}>
          {this.renderHeaderCard(truck)}
          <ReactDnd dataFormat={dividedByTruckOrders} getDataSort={this.getDataSort} />
          {/* <div style={{height: 400, width: '100%'}}>
            <VirtualizedTable
              rowCount={_orders.length}
              rowGetter={({index}) => _orders[index]}
              columns={[
                {
                  width: 20,
                  label: 'STT',
                  dataKey: 'index',
                  flexGrow: 1
                },
                {
                  width: 50,
                  label: 'Customer',
                  dataKey: 'customer',
                  flexGrow: 1
                },
                {
                  width: 220,
                  label: 'Delivery Place',
                  dataKey: 'address',
                  flexGrow: 1
                },
                {
                  width: 50,
                  label: 'Action',
                  dataKey: 'action',
                  flexGrow: 1,
                  maxWidth: 50
                }
              ]}
            />
          </div> */}
          {this.renderFooterCard(dividedByTruckOrders, orders, truck)}
        </CardView>
      </div>
    )
  }
}

Card.propTypes = {
  classes: PropTypes.object.isRequired,
}

export default withStyles(styles)(withRouter(Card))
