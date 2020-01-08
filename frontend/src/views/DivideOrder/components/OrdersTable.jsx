import React from 'react';
import PropTypes from 'prop-types';
import withStyles from '@material-ui/core/styles/withStyles';
import Typography from '@material-ui/core/Typography';
import BaseView from 'views/BaseView'
import PaperFade from 'components/Main/PaperFade';
import Utils from 'helpers/utility';
import {dateFormatDefault} from 'config/constant';
import {I18n} from 'helpers/I18n';
import moment from 'moment';

moment.defaultFormat = dateFormatDefault;

const GridTable = React.lazy(() => import('components/Table/GridTable'))
const styles = theme => ({
  gridTable: {
    overFlow: "auto",
    height: "50vh",
    maxHeight: "55vh",
  },
  driverName: {
    color: theme.palette.secondary.main,
    fontWeight: "500"
  }
});

class OrdersTable extends BaseView {
  constructor(props) {
    super(props)
    this.table = {
      columns: [
        {
          name: 'code',
          title: I18n.t('Table.code'),
          sortable: false
        },
        {
          name: 'insert',
          title: I18n.t('Table.order.orderDate'),
          type: "date",
          filterFormat: "DD/MM/YY",
          defaultFilterOperation: "daterange",
          formatterComponent: (data) => moment(data.value.when).format(),
          sortable: false,
          width: 110
        },
        {
          name: 'deliveryDate',
          title: I18n.t('Table.order.deliveryDate'),
          type: "date",
          filterFormat: "DD/MM/YY",
          defaultFilterOperation: "daterange",
          formatterComponent: (data) => moment(data.value).format(),
          sortable: false,
          width: 110
        },
        {
          name: 'customer.name',
          title: I18n.t('Table.customer.name'),
          formatterComponent: (data) => {
            let customerName = this.getData(data, "row.customer.name", "");
            if (customerName) return customerName;
            return this.getData(data, "row.customer._id", "");
          },
          sortable: false
        },
        {
          name: 'deliveryTime',
          title: I18n.t('Table.order.deliveryTime'),
          formatterComponent: (data) => Utils._formatDeliveryTime(data),
          sortable: false,
          width: 90
        },
        {
          name: 'area.code',
          title: I18n.t('Table.area.code'),
          formatterComponent: (data) => {
            const codeArea = this.getData(data, "row.area.code", "");
            if (codeArea) return codeArea;
            return this.getData(data, "row.area._id", "");
          },
          sortable: false,
          width: 90
        },
        {
          name: 'deliveryAddress',
          title: I18n.t('Table.order.address'),
          sortable: false

        },
        {
          name: 'orderDetails',
          title: I18n.t('Table.order.expectNum'),
          formatterComponent: (data) => {
            return this.renderDetailsColumn(data);
          },
          sortable: false
        },
        {
          name: 'status',
          title: I18n.t('Table.status'),
          formatterComponent: (data) => {
            if (Number(data.value) !== 1) {
              let nameDriver = this.getData(data, "row.truck.driver.firstName", "") + " " + this.getData(data, "row.truck.driver.lastName", "");
              return <Typography className={this.props.classes.driverName}>{nameDriver}</Typography>;
            } else {
              return I18n.t('Label.statusOrder.waiting');
            }
          },
          sortable: false,
          width: 130
        }
      ],
      defaultSort: [],
    }
    this.renderSelectedActions = this.renderSelectedActions.bind(this);
  }

  renderDetailsColumn(data) {
    let results = data.value.map(fuel =>
      <li style={{paddingLeft: '2px'}} key={fuel.name}>
        {I18n.t(`Label.products.${fuel.name}`)}: {fuel.quantity} L
      </li>
    )
    return <ul style={{paddingLeft: '12px'}}>{results}</ul>
  }

  renderSelectedActions(selectedIds) {
    let count = selectedIds.length || 0;
    const {onSelectOrder} = this.props;
    onSelectOrder(selectedIds);
    return <Typography variant="h6">{I18n.t('Label.orderSelected')}: {count} </Typography>
  }

  render() {
    const {classes} = this.props;
    let {orders} = this.props;
    if (!Array.isArray(orders)) orders = [];

    return (
      <PaperFade showLoading={true}>
        <GridTable
          id="OrdersTable"
          className={classes.gridTable}
          onFetchData={() => {
            return 1
          }}
          onRefTable={this.props.onRefTable}
          columns={this.table.columns}
          rows={orders}
          filterHiding={true}
          pagingHiding={true}
          defaultSort={this.table.defaultSort}
          showCheckboxColumn={true}
          selectedActions={this.renderSelectedActions}
          height="auto"
        />
      </PaperFade>
    )
  }
}

OrdersTable.propTypes = {
  classes: PropTypes.object.isRequired,
};

export default withStyles(styles)(OrdersTable);
