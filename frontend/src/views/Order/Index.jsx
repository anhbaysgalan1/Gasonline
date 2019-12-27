import React from 'react';
import PropTypes from 'prop-types';
import {withRouter} from 'react-router-dom';
import withStyles from '@material-ui/core/styles/withStyles';
import {Chip, Typography} from '@material-ui/core';
import BaseView from 'views/BaseView';
import PaperFade from 'components/Main/PaperFade';
import SelectField, {Option} from 'components/Forms/SelectField';
import Utils from 'helpers/utility';
import {I18n} from 'helpers/I18n';

const GridTable = React.lazy(() => import('components/Table/GridTable'));
const styles = theme => ({
  driverName: {
    color: theme.palette.secondary.main,
    fontWeight: "500"
  },
  fixColumn: {
    whiteSpace: 'normal',
  }
});

class Index extends BaseView {
  constructor(props) {
    super(props)
    this.state = {}
    this.table = {
      columns: [
        {
          name: 'code',
          title: I18n.t('Table.code'),
          width: 150
        },
        {
          name: 'insert.when',
          title: I18n.t('Table.order.orderDate'),
          type: "date",
          filterFormat: "DD/MM/YY",
          defaultFilterOperation: "daterange",
          formatterComponent: (data) => this.renderDataField(data, 'insert.when', 'date'),
          width: 90
        },
        {
          name: 'deliveryDate',
          title: I18n.t('Table.order.deliveryDate'),
          type: "date",
          filterFormat: "DD/MM/YY",
          defaultFilterOperation: "daterange",
          formatterComponent: (data) => this.renderDataField(data, null, 'date'),
          width: 90
        },
        {
          name: 'customer.name',
          title: I18n.t('Table.customer.name'),
          formatterComponent: (data) => this.renderDataField(data, 'customer.name')
        },
        {
          name: 'deliveryTime',
          title: I18n.t('Table.order.deliveryTime'),
          type: "number",
          formatterComponent: (data) => Utils._formatDeliveryTime(data),
          editorComponent: ({value, onValueChange}) => (
            <SelectField
              value={value}
              onChange={onValueChange}
              fullWidth
            >
              <Option value="">{I18n.t("Label.all")}</Option>
              {Utils.renderDeliveryTimeOptions()}
            </SelectField>)
        },
        {
          name: 'area.code',
          title: I18n.t('Table.area.code'),
          formatterComponent: data => this.renderDataField(data, 'area.code'),
          width: 90
        },
        {
          name: 'deliveryAddress',
          title: I18n.t('Table.order.address'),
          formatterComponent: (data) => <Typography noWrap={true}>{data.value}</Typography>
        },
        {
          name: 'orderDetails',
          filterable: false,
          sortable: false,
          title: I18n.t('Table.order.expectNum'),
          formatterComponent: (data) => {
            return this.renderDetailsColumn(data);
          }
        },
        {
          name: 'status',
          title: I18n.t('Table.status'),
          formatterComponent: (data) => {
            return this.mapLabelStatus(data);
          }
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
    this.ConfirmDeleteDialog = null;
    this.toolbarActions = [
      {key: "create", path: "/orders/create", icon: "add_circle_outline"},
      // {key: "exportCSV", path: null, icon: "cloud_download"},
      // {key: "print", path: null, icon: "local_printshop"},
    ];
    this.columnActions = [
      {key: "edit", path: "/orders/edit", icon: "edit"},
      {key: "detail", path: "/orders/detail", icon: "assignment"},
      {key: "shareOrder", path: "/divide-order", icon: "FontAwesomeIcon"}
    ];
    this.renderToolbarActions = this.renderToolbarActions.bind(this)
    this.renderSelectedActions = this.renderSelectedActions.bind(this)
  }

  renderDetailsColumn(data) {
    let results = data.value.map(fuel =>
      <li style={{paddingLeft: '2px'}} key={fuel.name}>
        {I18n.t(`Label.products.${fuel.name}`)}: {fuel.quantity} L
      </li>
    )
    return <ul style={{paddingLeft: '12px'}}>{results}</ul>
  }

  mapLabelStatus(data) {
    let driver = this.getData(data, "row.driver.fullName", "");
    switch (data.value) {
      case 1:
        return <Chip size="small" label={I18n.t('Label.statusOrder.waiting')}/>;

      case 2:
        return (
            <div align="center">
              <Chip size="small" color="secondary" label={driver}/>
              <Typography align="center" variant="caption" style={{display: "block"}}>
                {I18n.t('Label.statusOrder.divided')}
              </Typography>
            </div>
        );

      case 3:
        return (
          <React.Fragment>
            <Chip size="small" color="primary" label={driver}/>
            <Typography align="center" variant="caption" style={{display: "block"}}>
              {I18n.t('Label.statusOrder.delivered')}
            </Typography>
          </React.Fragment>
        );

      default:
        break;
    }
    return "";
  }

  render() {
    const {classes} = this.props;
    let orders = this.getData(this.props, 'orders', {})

    return (
      <PaperFade showLoading={true}>
        <GridTable
          id="OrderIndex"
          className={classes.gridTable}
          onFetchData={this.props.onFetchData}
          onRefTable={this.props.onRefTable}
          columns={this.table.columns}
          rows={orders ? orders.list_data : []}
          totalCount={orders ? orders.total : 0}
          pageSize={orders ? orders.pageSize : 20}
          defaultSort={this.table.defaultSort}
          showCheckboxColumn={true}
          height="auto"
          selectedActions={this.renderSelectedActions}
          tableActions={this.renderToolbarActions}
        />
        {this.renderDialogConfirmDelete()}
      </PaperFade>
    )
  }
}

Index.propTypes = {
  classes: PropTypes.object.isRequired,
};

export default withStyles(styles)(withRouter(Index));
