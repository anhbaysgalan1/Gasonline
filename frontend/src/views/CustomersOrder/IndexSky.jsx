import React from 'react'
import PropTypes from 'prop-types'
import { withRouter } from 'react-router-dom'
import withStyles from '@material-ui/core/styles/withStyles'
import BaseView from 'views/BaseView'
import PaperFade from 'components/Main/PaperFade'
import { I18n } from 'helpers/I18n';
import { Button, Tooltip } from '@material-ui/core'
import moment from 'moment';
import {dateFormatBackend} from 'config/constant';
moment.defaultFormat = dateFormatBackend;

const GridTable = React.lazy(() => import('components/Table/GridTable'))
const styles = theme => ({
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
      minHeight: 'calc(100vh - 355px) !important',
      maxHeight: 'calc(100vh - 355px) !important',
      [theme.breakpoints.down('sm')] : {
        minHeight: 'calc(100vh - 360px) !important',
      },
      ['@media (min-width:601px) and (max-width:959px)']: {
        minHeight: 'calc(100vh - 435px) !important',
      }
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
          title: I18n.t('Label.amount'),
          formatterComponent: (data) => this.renderDataField(data, 'amount') || 0,
          sortable: false
        },
        {
          name: 'insurance',
          title: I18n.t('Label.insurance'),
          filterable: false,
          sortable: false,
          formatterComponent: (data) => this.renderDataField(data, 'insurance') || ''
        },
      ]
    }
  }

  addIdToData () {
    const {data = []} = this.props; 
    return data.map((item, index) => ({
        ...item,
        id: this.getData(item, 'customer._id', index)
      })
    )
  }

  renderToolbarActions = () => {
    const {startDate, endDate} = this.props.invoiceDate || {},
      {classes} = this.props;
    return (
      <Tooltip title={I18n.t("Tooltip.exportExcel")} key="exportExcel">
        <span className={classes.gridTableFooterButtonRight}>
          <Button
            disabled={!startDate || !endDate} 
            color='primary' variant='contained' onClick={this.exportExcel}>
            {I18n.t("Button.exportExcel")}
          </Button>
        </span>
      </Tooltip>
    )
  }

  exportExcel = (e) =>{
    e.preventDefault();
    let {startDate, endDate} = this.props.invoiceDate || {};
    
    if(!startDate || !endDate) return;

    startDate = moment(startDate).format("YYYYMMDD")
    endDate = moment(endDate).format("YYYYMMDD")

    this.props.onExportFile({
      startDate, endDate, type: '1'
    })
  }

  render() {
    const { classes, onRefTable } = this.props;
    let  data = this.addIdToData();

    return (
      <PaperFade showLoading={true}>
        <GridTable
          id="CustomersOrderIndexSky"
          className={classes.gridTable}
          onFetchData={()=>{}}
          onRefTable={onRefTable}
          columns={this.table.columns}
          rows={data}
          totalCount={data.length}
          pageSize={data.length}
          showCheckboxColumn={false}
          height="auto"
          filterHiding={true}
          pagingHiding={true}
        />
        <div className={classes.gridTableFooter}>
          {this.renderToolbarActions()}
        </div>
      </PaperFade>
    )
  }
}

IndexSky.propTypes = {
  classes: PropTypes.object.isRequired,
};

export default withStyles(styles)(withRouter(IndexSky));
