import React from 'react';
import PropTypes from 'prop-types';
import {withRouter} from 'react-router-dom';
import withStyles from '@material-ui/core/styles/withStyles';
import ExpandMoreIcon from '@material-ui/icons/ExpandMore';
import {
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  ExpansionPanel,
  ExpansionPanelDetails,
  ExpansionPanelSummary,
  Grid,
  Icon,
  IconButton,
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableRow,
  Typography
} from '@material-ui/core';
import DateTimeField from 'components/Forms/DateTimeField';
import PaperFade from 'components/Main/PaperFade';
import BaseView from 'views/BaseView';
import {dateFormatBackend, dateFormatDefault} from 'config/constant';
import Utils from 'helpers/utility';
import {I18n} from 'helpers/I18n';
import moment from 'moment';

moment.defaultFormat = dateFormatBackend;

const styles = theme => ({
  paper: {
    padding: '5px 5px',
    margin: 0
  },
  paddingTable: {
    padding: '0px 0px 0px 0px'
  },
  paddingTableInfo: {
    paddingBottom: 0,
    paddingTop: 0,
    paddingLeft: 0,
  },
  gridTable: {
    overFlow: "auto",
  },
  positionRightBottom: {
    [theme.breakpoints.down('xs')]: {
      textAlign: 'right'
    },
  },
})

class Index extends BaseView {
  constructor(props) {
    super(props)
    this.state = {
      open: false,
      reload: false,
      date: moment()
    }
    this.onChangeDate = this.onChangeDate.bind(this)
  }

  onShow = () => {
    this.setState({open: true, reload: !this.state.reload})
  }

  onClose = () => {
    this.setState({open: false, reload: !this.state.reload})
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
        style={{marginTop: '10px'}}
      />
    )
  }

  renderDetailFuels(data, classes) {
    return ['name', 'quantity', 'numberDelivered'].map((field, index) => {
      let value = this.getData(data, field, 0);
      if (field === 'name') value = I18n.t(`Label.products.${value}`);
      return (<TableCell key={index} align='left' className={classes.paddingTable}>{value}</TableCell>)
    })
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
        <TableCell key={key} align='left' className={classes.paddingTable}>
          {I18n.t(`Table.order.${key}`)} {fields[key]}
        </TableCell>
      )
    }
    return arr
  }

  renderOrderInfo(order, classes) {
    const arr = [
      {label: 'customer.code', field: 'customer.code', format: null},
      {label: 'customer.name', field: 'customer.name', format: null},
      {label: 'area.code', field: 'area.code', format: null},
      {label: 'order.deliveryTime', field: 'deliveryTime', format: (value) => Utils._formatDeliveryTime(value)},
      {label: 'order.address', field: 'deliveryAddress', format: null},
    ]
    return (
      <Table>
        <TableBody>
          {
            arr.map((item, index) => {
              let value = this.getData(order, item.field, '');
              if (item.format) value = item.format(value)
              return (
                <TableRow key={index}>
                  <TableCell className={classes.paddingTableInfo}>
                    {I18n.t(`Table.${item.label}`)}
                  </TableCell>
                  <TableCell className={classes.paddingTableInfo}>
                    <b>{value}</b>
                  </TableCell>
                </TableRow>
              )
            })
          }
        </TableBody>
      </Table>
    )

  }

  delivery = (id) => {
    this.goto(`/delivery/${id}`)
  }

  submitComplete = () => {
    // this.props.onSubmit()
    this.onClose()
  }

  dialogComplete() {
    return (
      <Dialog
        open={this.state.open}
        onClose={this.onCancel}
        aria-labelledby="alert-dialog-title"
        fullWidth
        maxWidth='xs'
        aria-describedby="alert-dialog-description"
      >
        <DialogTitle id="alert-dialog-title">
          {I18n.t("Tooltip.completeOrder")}
        </DialogTitle>
        <DialogContent>
          {I18n.t("Confirm.completeOrder")}
        </DialogContent>
        <DialogActions>
          <Button color="primary" onClick={this.onClose}>
            {I18n.t("Button.cancel")}
          </Button>
          <Button color="primary" onClick={this.submitComplete}>
            {I18n.t("Button.confirm")}
          </Button>
        </DialogActions>
      </Dialog>
    )
  }

  render() {
    const {classes, orders = []} = this.props;
    return (
      <PaperFade showLoading={true} className={classes.paper}>
        {this.dialogComplete()}
        {this.renderFilterDate()}
        {orders.length ?
          orders.map((item, index) => {
            let _id = this.getData(item, '_id', '')
            let orderDetails = this.getData(item, 'orderDetails', [])
            let orderStatus = this.getData(item, 'status', '')
            return (
              <ExpansionPanel key={index}>
                <ExpansionPanelSummary expandIcon={<ExpandMoreIcon/>}>
                  <Grid container spacing={0}>
                    <Grid item xs={10}>
                      <Typography color='primary'>
                        {index + 1}, {this.getData(item, 'code', '')}
                      </Typography>
                    </Grid>

                    <Grid item xs={2}>
                      {
                        index == 2
                          ? <IconButton size='small' key="finish">
                            <Icon color='primary'>done</Icon>
                          </IconButton>
                          : <IconButton size='small' onClick={() => this.delivery(_id)} key="create">
                            <Icon>add_circle_outline</Icon>
                          </IconButton>
                      }
                    </Grid>
                  </Grid>
                </ExpansionPanelSummary>

                <ExpansionPanelDetails>
                  <Grid container direction="row" spacing={2}>
                    <Grid item xs={12}>
                      {this.renderOrderInfo(item, classes)}
                      <br/>
                      <Table className={classes.paddingTable}>
                        <TableHead className={classes.paddingTable}>
                          <TableRow>{this.renderDetailHead(classes)}</TableRow>
                        </TableHead>
                        <TableBody className={classes.paddingTable}>
                          {
                            orderDetails.map((item, index) => {
                              return (
                                <TableRow key={index}>
                                  {this.renderDetailFuels(item, classes)}
                                </TableRow>
                              )
                            })
                          }
                        </TableBody>
                      </Table>
                      <div className={classes.positionRightBottom}>
                        {
                          index == 2
                            ? ''
                            : <IconButton key='complete' size='small' onClick={() => this.onShow()}>
                              <Icon>offline_pin</Icon>
                            </IconButton>
                        }
                      </div>
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
