import React from 'react'
import PropTypes from 'prop-types'
import { withRouter } from 'react-router-dom'
import withStyles from '@material-ui/core/styles/withStyles'
import {
  Chip,
  Typography,
  Button,
  Table,
  TableHead,
  TableBody,
  TableRow,
  TableCell,
} from '@material-ui/core'
import BaseView from 'views/BaseView'
import PaperFade from 'components/Main/PaperFade'
import { I18n } from 'helpers/I18n'
import moment from 'moment'

const CustomTableCell = withStyles(theme => ({
  head: {
    backgroundColor: "#bbdefb"
  },
  body: {
    fontSize: 14
  }
}))(TableCell)
const GridTable = React.lazy(() => import('components/Table/GridTable'))
const styles = theme => ({
  // gridTable: {
  //   overFlow: "auto",
  //   height: 'calc(82vh)'
  // },
  driverName: {
    color: theme.palette.secondary.main,
    fontWeight: "500"
  },
  fixColumn: {
    whiteSpace: 'normal',
  },
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
        },
        {
          name: '_id',
          title: I18n.t('Table.action'),
          filterable: false,
          sortable: false,
          formatterComponent: (data) => {
            return this.renderActionsColumn(data)
          }
        },
      ],
      defaultSort: [],
    }
    this.toolbarActions = [];
    this.renderToolbarActions = this.renderToolbarActions.bind(this)
  }

  viewReport = (data) =>{
    let {invoiceDate} = this.props
    let startDate = moment(invoiceDate.startDate).format("YYYYMMDD")
    let endDate = moment(invoiceDate.endtDate).format("YYYYMMDD")
    let customerId = data.row.customer._id

    let url = window.config.API_HOST + `/api/authWithSession?token=${localStorage.getItem("token")}&redirect=/pdf/invoice-${customerId}-${startDate}-${endDate}.pdf`
    window.open(url);
  }
  viewReportMC = () =>{
    let {invoiceDate,filters} = this.props
    let startDate = moment(invoiceDate.startDate).format("YYYYMMDD")
    let endDate = moment(invoiceDate.endtDate).format("YYYYMMDD")

    let url = window.config.API_HOST + `/api/authWithSession?token=${localStorage.getItem("token")}&redirect=/pdf/invoicemc-${startDate}-${endDate}-${filters.paymentTerm}.pdf`

    if(filters.customer){
      url = window.config.API_HOST + `/api/authWithSession?token=${localStorage.getItem("token")}&redirect=/pdf/invoicemc-${startDate}-${endDate}-${filters.paymentTerm}-${filters.customer}.pdf`
    }
    window.open(url);
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
      <Table>
        <TableHead>
          <TableRow >
            <TableCell style={{width: "20%"}}> {I18n.t('Table.customer.name')} </TableCell>
            <TableCell style={{width: "10%"}}> {I18n.t('Label.products.diesel')} </TableCell>
            <TableCell style={{width: "10%"}}> {I18n.t('Label.products.dieselFreeTax')} </TableCell>
            <TableCell style={{width: "10%"}}> {I18n.t('Label.products.kerosene')} </TableCell>
            <TableCell style={{width: "10%"}}> {I18n.t('Label.products.gasoline')} </TableCell>
            <TableCell style={{width: "10%"}}> {I18n.t('Label.products.adBlue')} </TableCell>
            <TableCell style={{width: "10%"}}> {I18n.t('Table.amount')} </TableCell>
            <TableCell style={{width: "10%"}}> {I18n.t('Label.insurance')} </TableCell>
            <TableCell> {I18n.t('Table.action')} </TableCell>
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
            <TableCell>
              <Button color='primary' variant='outlined'
                onClick={() => this.viewReportMC()}
                >
                {I18n.t('Button.confirm')}
              </Button>
              </TableCell>
          </TableRow>
        </TableBody>
      </Table>
    )
  }

  render() {
    const { classes, data, onRefTable } = this.props;
    return (
      <PaperFade showLoading={true}>
        {
          this.renderMCTotal(classes)
        }
        <GridTable
          id="IndexMC"
          className={classes.gridTable}
          onFetchData={() => {}}
          onRefTable={onRefTable}
          columns={this.table.columns}
          rows={data || []}
          totalCount={(data || []).length}
          pageSize={(data || []).length}
          showCheckboxColumn={false}
          height="auto"
          filterHiding={true}
          selectedActions={this.renderSelectedActions}
          tableActions={this.renderToolbarActions}
        />
        {this.renderDialogConfirmDelete()}
      </PaperFade>
    )
  }
}

IndexMC.propTypes = {
  classes: PropTypes.object.isRequired,
};

export default withStyles(styles)(withRouter(IndexMC));
