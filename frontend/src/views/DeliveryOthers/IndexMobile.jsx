import React from 'react'
import PropTypes from 'prop-types'
import {withRouter} from 'react-router-dom'
import withStyles from '@material-ui/core/styles/withStyles'
import {
  ExpansionPanel,
  ExpansionPanelDetails,
  ExpansionPanelSummary,
  Grid,
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableRow,
  Typography
} from '@material-ui/core'
import ExpandMoreIcon from '@material-ui/icons/ExpandMore'
import DateTimeField from 'components/Forms/DateTimeField'
import PaperFade from 'components/Main/PaperFade'
import BaseView from 'views/BaseView'
import {dateFormatDefault} from 'config/constant'
import Utils from 'helpers/utility'
import moment from 'moment'
import {I18n} from 'helpers/I18n'
import _ from 'lodash'

moment.defaultFormat = "YYYY/MM/DD"

const styles = theme => ({
  paper: {
    padding: '0px 0px',
    margin: 0
  },
  gridTable: {
    overFlow: "auto",
  },
})

class Index extends BaseView {
  constructor(props) {
    super(props)
    this.state = {
      reload: false,
      date: moment()
    }
    this.onChangeDate = this.onChangeDate.bind(this)
  }

  onChangeDate(date) {
    this.setState({date: date})
    this.props.onFetchData({date: date.format()});
  }

  renderFilterDate() {
    let {date} = this.state
    return (
      <DateTimeField
        label={I18n.t(`Input.order.deliveryDate`)}
        name="deliveryDate"
        format={dateFormatDefault}
        showTime={false}
        autoOk={true}
        value={date}
        onChange={this.onChangeDate}
        InputProps={{readOnly: true}}
        style={{marginTop: 0}}
      />
    )
  }

  renderDetailHead = (classes) => {
    const fields = {
      fuel: '',
      expectNum: '(L)',
      deliveryNum: '(L)'
    };
    let arr = [];
    for (let key in fields) {
      arr.push(
        <TableCell key={key} align='left' className={classes ? classes.paper : ''}>
          {I18n.t(`Table.order.${key}`)} {fields[key]}
        </TableCell>
      )
    }
    return arr
  }

  renderDetailFuels(data, classes) {
    return ['name', 'quantity', 'numberDelivered'].map(field => {
      let value = this.getData(data, field, 0);
      if (field === 'name') value = I18n.t(`Label.products.${value}`)
      return (<TableCell key={field} align='left' className={classes ? classes.paddingTable : ''}>{value}</TableCell>)
    })
  }

  render() {
    const {classes, trucks = []} = this.props
    const fitlerDate = this.renderFilterDate()
    let checkExist = false
    if (!_.isEmpty(trucks)) {
      checkExist = true
    }
    return (
      <PaperFade showLoading={true} className={classes.paper}>
        {fitlerDate}
        {
          checkExist
            ? trucks.map((item, index) => {
              let driverFullName = _.get(item, 'driver.fullName', '')
              let orders = _.get(item, 'orders', [])
              return (
                <ExpansionPanel key={index}>
                  <ExpansionPanelSummary className={classes.paper} expandIcon={<ExpandMoreIcon/>}>
                    <Typography color='primary'>{index + 1}, {driverFullName}</Typography>
                  </ExpansionPanelSummary>
                  <ExpansionPanelDetails className={classes.paper}>
                    <Grid container direction="row" spacing={0}>
                      <Grid item xs={12}>
                        {
                          orders.map((element, count) => {
                            let orderDetails = this.getData(element, 'orderDetails', [])
                            return (
                              <Grid container direction="row" spacing={0} key={count}>
                                <Grid item xs={12}>
                                  <ExpansionPanel>
                                    <ExpansionPanelSummary className={classes.paper}>
                                      <Grid container spacing={1}>
                                        <Grid item xs={9}>
                                          <Typography
                                            display='inline'>{count + 1}, {this.getData(element, 'customer.name', '')} ({this.getData(element, 'customer.code', '')}) </Typography>
                                          <Typography> {this.getData(element, 'deliveryAddress', '')} ({this.getData(element, 'area.code', '')}) </Typography>
                                        </Grid>
                                        <Grid item xs={3}>
                                          {Utils._formatOrderStatus(this.getData(element, 'status', ''))}
                                          <Typography> {Utils._formatDeliveryTime(this.getData(element, 'deliveryTime', ''))}</Typography>
                                        </Grid>
                                      </Grid>
                                    </ExpansionPanelSummary>
                                    <ExpansionPanelDetails className={classes.paper}>
                                      <Table className={classes.paper}>
                                        <TableHead className={classes.paper}>
                                          <TableRow>{this.renderDetailHead()}</TableRow>
                                        </TableHead>
                                        <TableBody className={classes.paper}>
                                          {
                                            orderDetails.map((item, index) => {
                                              return (
                                                <TableRow key={index}>
                                                  {this.renderDetailFuels(item)}
                                                </TableRow>
                                              )
                                            })
                                          }
                                        </TableBody>
                                      </Table>
                                    </ExpansionPanelDetails>
                                  </ExpansionPanel>
                                  <br/>
                                </Grid>
                              </Grid>
                            )
                          })
                        }
                      </Grid>
                    </Grid>
                  </ExpansionPanelDetails>
                </ExpansionPanel>
              )
            })
            : ''
        }
      </PaperFade>
    )
  }
}

Index.propTypes = {
  classes: PropTypes.object.isRequired,
};

export default withStyles(styles)(withRouter(Index));
