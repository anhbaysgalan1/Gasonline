import React from 'react'
import PropTypes from 'prop-types'
import { withRouter } from 'react-router-dom'
import withStyles from '@material-ui/core/styles/withStyles'
import { Chip, Typography, Grid, Card, CardContent, CardActions, Button } from '@material-ui/core'
import BaseView from 'views/BaseView'
import PaperFade from 'components/Main/PaperFade'
import SelectField, { Option } from 'components/Forms/SelectField'
import Utils from 'helpers/utility'
import { I18n } from 'helpers/I18n'
import moment from 'moment'


const GridTable = React.lazy(() => import('components/Table/GridTable'))
const styles = theme => ({
  driverName: {
    color: theme.palette.secondary.main,
    fontWeight: "500"
  },
  fixColumn: {
    whiteSpace: 'normal',
  },
});

class IndexSky extends BaseView {
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
          width: '20%'
        },
        {
          name: 'diesel',
          title: I18n.t('Label.products.diesel'),
          formatterComponent: (data) => this.renderDataField(data, 'diesel') || 0,
          sortable: false
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
          name: 'customer._id',
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
    this.ConfirmDeleteDialog = null;
    this.toolbarActions = [];

    this.renderToolbarActions = this.renderToolbarActions.bind(this)
    this.renderSelectedActions = this.renderSelectedActions.bind(this)
  }

  viewReport = (data) =>{
    let {invoiceDate} = this.props
    let startDate = moment(invoiceDate.startDate).format("YYYYMMDD")
    let endDate = moment(invoiceDate.endtDate).format("YYYYMMDD")
    let customerId = data.row.customer._id

    let url = window.config.API_HOST + `/api/authWithSession?token=${localStorage.getItem("token")}&redirect=/pdf/invoice-${customerId}-${startDate}-${endDate}.pdf`
    window.open(url);
  }
  renderActionsColumn(data){

    return (
      <Button color='primary' variant='outlined' onClick={() => this.viewReport(data)}>
        {I18n.t('Button.confirm')}
      </Button>
    )
  }


  render() {
    const { classes, data, onRefTable } = this.props;
    return (
      <PaperFade showLoading={true}>
        <GridTable
          id="IndexSky"
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
          tableActions={this.renderToolbarActions}
        />
      </PaperFade>
    )
  }
}

IndexSky.propTypes = {
  classes: PropTypes.object.isRequired,
};

export default withStyles(styles)(withRouter(IndexSky));
