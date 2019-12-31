import React from 'react';
import PropTypes from 'prop-types';
import {withRouter} from 'react-router-dom';
import withStyles from '@material-ui/core/styles/withStyles';
import {
  Button,
  Card,
  CardContent,
  Chip,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  Hidden,
  Icon,
  IconButton,
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableRow,
  Tooltip,
  Typography,
} from '@material-ui/core';
import ConfirmDialog from 'components/Dialogs/ConfirmDialog';
import DateTimeField from 'components/Forms/DateTimeField';
import PaperFade from 'components/Main/PaperFade';
import BaseView from 'views/BaseView';
import IndexMobile from './IndexMobile';
import {dateFormatBackend, dateFormatDefault, statusOrder} from 'config/constant';
import Utils from 'helpers/utility';
import {I18n} from 'helpers/I18n';
import moment from 'moment';

moment.defaultFormat = dateFormatBackend;
const GridTable = React.lazy(() => import('components/Table/GridTable'))
const styles = theme => ({
  paper: {
    padding: '5px 5px',
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
      open: false,
      reload: false,
      dataRow: '',
      completeOpen: false,
      date: moment()
    }
    this.renderToolbarActions = this.renderToolbarActions.bind(this)
    this.onChangeDate = this.onChangeDate.bind(this)
    this.table = {
      columns: [
        {
          name: 'no',
          title: I18n.t('Table.no'),
          sortable: false,
          width: 100
        },
        {
          name: 'code',
          title: I18n.t('Table.code'),
          sortable: false,
        },
        {
          name: 'customer',
          title: I18n.t('Table.customer.code'),
          sortable: false,
          formatterComponent: (data) => this.renderDataField(data, 'customer.code')
        },
        {
          name: 'deliveryTime',
          title: I18n.t('Table.order.deliveryTime'),
          sortable: false,
          formatterComponent: (data) => Utils._formatDeliveryTime(data)
        },
        {
          name: 'area',
          title: I18n.t('Table.area.code'),
          sortable: false,
          formatterComponent: data => this.renderDataField(data, 'area.code')
        },
        {
          name: 'deliveryAddress',
          title: I18n.t('Table.order.address'),
          sortable: false,
          formatterComponent: (data) => <Typography noWrap={true}>{data.value}</Typography>
        },
        {
          name: '_id',
          title: I18n.t('Table.action'),
          sortable: false,
          formatterComponent: (data) => {
            return this.renderActionsColumn(data)
          }
        },
      ],
      defaultSort: [],
    }
  }

  showComplete = () => {
    this.setState({completeOpen: true, reload: !this.state.reload})
  }

  onShow = () => {
    this.setState({open: true, reload: !this.state.reload})
  }

  onClose = () => {
    this.setState({open: false, completeOpen: false, reload: !this.state.reload})
  }

  onChangeDate(date) {
    this.setState({date: date})
    this.props.onFetchData({date: date.format()});
  }

  onSetDataDetail = (data) => {
    this.setState({dataRow: data})
    this.onShow()
  }

  submitComplete = () => {
    // this.props.onSubmit()
    this.onClose()
  }

  dialogComplete() {
    return (
      <Dialog
        open={this.state.completeOpen}
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

  renderDialogConfirm() {
    return <ConfirmDialog
      ref={(ref) => this.ConfirmSubmitDialog = ref}
      title={I18n.t('Confirm.updatePrice')}
      content={I18n.t('Notification.update')}
      onCancel={() => window.location.reload()}
      onSubmit={data => {
        this.props.onSubmitData(data);
        this.listEditing = [];
      }}
    />
  }

  renderActionsColumn(data) {
    let dataRow = this.getData(data, 'row', {});
    let orderStatus = this.getData(dataRow, 'status', '');

    if (orderStatus === statusOrder.delivered) {
      return (
        <React.Fragment>
          <Chip color="primary" size="small" label={I18n.t("Label.statusOrder.done")}/>
          <Tooltip title={I18n.t("Button.detail")} key="detail">
            <IconButton onClick={() => this.onSetDataDetail(dataRow)} key="detail">
              <Icon>details</Icon>
            </IconButton>
          </Tooltip>
        </React.Fragment>
      )
    }

    return (
      <div>
        <Tooltip title={I18n.t("Button.detail")} key="detail">
          <IconButton onClick={() => this.onSetDataDetail(dataRow)} key="detail">
            <Icon>details</Icon>
          </IconButton>
        </Tooltip>
        <Tooltip title={I18n.t("Tooltip.deliver")} key="deliver">
          <IconButton onClick={() => this.goto(`/delivery/${data.value}`)} key="deliver">
            <Icon>add_circle_outline</Icon>
          </IconButton>
        </Tooltip>
        <Tooltip title={I18n.t("Tooltip.completeOrder")} key="complete">
          <IconButton key="complete" onClick={this.showComplete}>
            <Icon>offline_pin</Icon>
          </IconButton>
        </Tooltip>
      </div>
    )
  }

  renderToolbarActions() {
    let {date} = this.state;
    return (
      <DateTimeField
        label={I18n.t(`Input.order.deliveryDate`)}
        name="deliveryDate"
        format={dateFormatDefault}
        showTime={false}
        autoOk={true}
        value={date}
        onChange={this.onChangeDate}
        InputProps={{
          readOnly: true
        }}
        style={{
          marginTop: 0
        }}
      />
    )
  }

  renderDetail() {
    let {dataRow} = this.state;
    let orderDetails = this.getData(dataRow, 'orderDetails', []);
    return (
      <Dialog
        fullWidth={true}
        maxWidth="xs"
        open={this.state.open}
        onClose={this.onClose}
        aria-labelledby="responsive-dialog-title"
      >
        <DialogContent>
          <Table aria-label="simple table">
            <TableHead>
              <TableRow>{this.renderDetailHead()}</TableRow>
            </TableHead>
            <TableBody>
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
        </DialogContent>
        <DialogActions>
          <Button onClick={this.onClose} size='small' color="primary" variant={"outlined"}>
            {I18n.t("Button.close")}
          </Button>
        </DialogActions>
      </Dialog>
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
        <TableCell key={key} align='left' className={classes ? classes.paddingTable : ''}>
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
      return (<TableCell align='left' key={field} className={classes ? classes.paddingTable : ''}>{value}</TableCell>)
    })
  }

  render() {
    const {classes, onFetchData, orders} = this.props
    return (
      <PaperFade showLoading={true} className={classes.paper}>
        <Hidden smUp>
          <IndexMobile
            classes={classes}
            orders={orders}
            onFetchData={onFetchData}
          />
        </Hidden>
        <Hidden xsDown>
          {this.dialogComplete()}
          {this.renderDetail()}
          <Card>
            <CardContent>
              <GridTable
                id="OrderIndex"
                className={classes.gridTable}
                onFetchData={this.props.onFetchData}
                onRefTable={this.props.onRefTable}
                columns={this.table.columns}
                rows={orders}
                filterHiding={true}
                defaultSort={this.table.defaultSort}
                height="auto"
                tableActions={this.renderToolbarActions}
              />
            </CardContent>
          </Card>
        </Hidden>
      </PaperFade>
    )
  }
}

Index.propTypes = {
  classes: PropTypes.object.isRequired,
};

export default withStyles(styles)(withRouter(Index));
