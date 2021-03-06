import React from 'react'
import PropTypes from 'prop-types'
import { withRouter } from 'react-router-dom'
import withStyles from '@material-ui/core/styles/withStyles'
import {
  Button,
  Table,
  TableHead,
  TableBody,
  TableRow,
  TableCell,
  Tooltip,
} from '@material-ui/core'
import BaseView from 'views/BaseView'
import PaperFade from 'components/Main/PaperFade'
import { I18n } from 'helpers/I18n'
import {dateFormatBackend} from 'config/constant';
import moment from 'moment'
moment.defaultFormat = dateFormatBackend;
const GridTable = React.lazy(() => import('components/Table/GridTable'))

const styles = theme => ({
  alignRight: {
    textAlign: 'right',
    marginRight: '50px'
  },
  driverName: {
    color: theme.palette.secondary.main,
    fontWeight: "500"
  },
  fixColumn: {
    whiteSpace: 'normal',
  },
  gridTable: {
    '& .MuiToolbar-root': {
      display: 'none !important'
    },

    '& .Grid-Root-Table': {
      minHeight: '0 !important',
      maxHeight: 'calc(100vh - 335px) !important',
      
      [theme.breakpoints.up('sm')] : {
        minHeight: 'calc(100vh - 510px) !important'
      },
      [theme.breakpoints.up('md')] : {
        minHeight: 'calc(100vh - 475px) !important'
      },
      ['@media (min-width:960px)'] : {
        minHeight: 'calc(100vh - 470px) !important'
      },
    }
  },
  gridTableFooter: {
    display: 'flex',
    flex: 'none',
    position: 'relative',
    alignItems: 'center',
    minHeight: '55px',
  },
  gridTableFooterButtonRight: {
    right: '0px',
    position: 'absolute'
  }
});

class IndexMC extends BaseView {
  constructor(props) {
    super(props)
    this.state = {}
    this.table = {
      columns: [
        {
          name: 'customer.name',
          title: I18n.t('Table.customer.name'),
          formatterComponent: (data) => this.renderDataField(data, 'customer.name'),
          sortable: false,
          width: "20%"
        },
        {
          name: 'diesel',
          title: I18n.t('Label.products.diesel'),
          formatterComponent: (data) => this.renderDataField(data, 'diesel') || 0,
          sortable: false,
        },
        {
          name: 'dieselFreeTax',
          title: I18n.t('Label.products.dieselFreeTax'),
          formatterComponent: (data) => this.renderDataField(data, 'dieselFreeTax') || 0,
          sortable: false
        },
        {
          name: 'kerosene',
          title: I18n.t('Label.products.kerosene'),
          formatterComponent: (data) => this.renderDataField(data, 'kerosene') || 0,
          sortable: false
        },
        {
          name: 'gasoline',
          title: I18n.t('Label.products.gasoline'),
          formatterComponent: (data) => this.renderDataField(data, 'gasoline') || 0,
          sortable: false
        },
        {
          name: 'adBlue',
          title: I18n.t('Label.products.adBlue'),
          formatterComponent: (data) => this.renderDataField(data, 'adBlue') || 0,
          sortable: false
        },
        {
          name: 'amount',
          title: I18n.t('Table.totalAmount'),
          formatterComponent: (data) => this.renderDataField(data, 'amount') || 0,
          sortable: false
        },
        {
          name: 'insurance',
          title: I18n.t('Label.insurance'),
          formatterComponent: (data) => this.renderDataField(data, 'insurance') || 0,
        }
      ]
    }
  }

  renderToolbarActions = () => {
    const {startDate, endDate} = this.props.invoiceDate || {},
      {classes} = this.props;

    return (
      <Tooltip title={I18n.t("Tooltip.exportExcel")} key="exportExcel">
        <span className={classes.gridTableFooterButtonRight}>
          <Button 
            disabled={!startDate || !endDate}
            color='primary'
            variant='contained'
            onClick={this.exportExcel}>
            {I18n.t("Button.exportExcel")}
          </Button>
        </span>
      </Tooltip>
    )
  }
  
  exportExcel = (e) => {
    e.preventDefault();
    let {startDate, endDate} = this.props.invoiceDate || {};

    if(!startDate || !endDate) return;

    startDate = moment(startDate).format("YYYYMMDD")
    endDate = moment(endDate).format("YYYYMMDD")

    this.props.onExportFile({
      startDate, endDate, type: '2'
    })
  }

  renderActionsColumn(data){
    return (
      <Button color='primary' variant='outlined' onClick={() => this.viewReport(data)}>
        {I18n.t('Button.confirm')}
      </Button>
    )
  }

  renderMCTotal(){
    const {overAll = {}} = this.props
    return (
      <div>
        <Table>
          <TableHead>
            <TableRow >
              <TableCell style={{width: "17%"}}> {I18n.t('Table.customer.name')} </TableCell>
              <TableCell style={{width: "10%"}}> {I18n.t('Label.products.diesel')} </TableCell>
              <TableCell style={{width: "10%"}}> {I18n.t('Label.products.dieselFreeTax')} </TableCell>
              <TableCell style={{width: "10%"}}> {I18n.t('Label.products.kerosene')} </TableCell>
              <TableCell style={{width: "10%"}}> {I18n.t('Label.products.gasoline')} </TableCell>
              <TableCell style={{width: "10%"}}> {I18n.t('Label.products.adBlue')} </TableCell>
              <TableCell style={{width: "10%"}}> {I18n.t('Table.amount')} </TableCell>
              <TableCell style={{width: "10%"}}> {I18n.t('Label.insurance')} </TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            <TableRow>
              <TableCell> エムシーセンター </TableCell>
              <TableCell> {overAll.diesel || 0} </TableCell>
              <TableCell> {overAll.dieselFreeTax || 0} </TableCell>
              <TableCell> {overAll.kerosene || 0} </TableCell>
              <TableCell> {overAll.gasoline || 0} </TableCell>
              <TableCell> {overAll.adBlue || 0} </TableCell>
              <TableCell> {overAll.amount || 0} </TableCell>
              <TableCell> {overAll.insurance || 0} </TableCell>
            </TableRow>
          </TableBody>
        </Table>
      </div>
    )
  }

  addIdToData() {
    const {data=[]} = this.props;
    return data.map((item, index) => ({
      ...item,
      id: this.getData(item, 'customer._id', index)
    }))
  }

  render() {
    const { classes, onRefTable } = this.props,
      data = this.addIdToData();

    return (
      <PaperFade showLoading={true}>
        {this.renderMCTotal(classes)}
        <GridTable
          id="CustomersOrderIndexMC"
          className={classes.gridTable}
          onFetchData={() => {}}
          onRefTable={onRefTable}
          columns={this.table.columns}
          rows={data}
          totalCount={data.length}
          pageSize={data.length}
          showCheckboxColumn={false}
          height="auto"
          filterHiding={true}
          pagingHiding={true}
          tableActions={this.renderToolbarActions}
        />
        <div className={classes.gridTableFooter}>
          {this.renderToolbarActions()}
        </div>
      </PaperFade>
    )
  }
}

IndexMC.propTypes = {
  classes: PropTypes.object.isRequired,
};

export default withStyles(styles)(withRouter(IndexMC));
