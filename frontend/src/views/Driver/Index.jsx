import React from 'react';
import PropTypes from 'prop-types';
import withStyles from '@material-ui/core/styles/withStyles';
import {withRouter} from 'react-router-dom'
import BaseView from 'views/BaseView'
import PaperFade from 'components/Main/PaperFade';
import {I18n} from 'helpers/I18n';

const GridTable = React.lazy(() => import('components/Table/GridTable'))
const styles = theme => ({
 
});

class Index extends BaseView {
  constructor(props) {
    super(props)
    this.state = {}
    this.table = {
      columns: [
        {
          name: 'no',
          title: I18n.t('Table.no'),
          filterable: false,
          sortable: false,
          width: 90
        },
        {
          name: 'code',
          title: I18n.t('Table.driver.code'),
          width: 200
        },
        {
          name: 'fullName',
          title: I18n.t('Table.driver.name'),
          width: 200
        },
        {
          name: 'email',
          title: I18n.t('Table.email'),
          width: 200
        },
        {
          name: 'card',
          title: I18n.t('Table.driver.cardNumber'),
          filterable: false,
          sortable: false,
          width: 350,
          formatterComponent: (data) => {
            return this.customCardNumColumn(data)
          }
        },
        {
          name: '_id',
          title: I18n.t('Table.action'),
          filterable: false,
          sortable: false,
          width: 150,
          formatterComponent: (data) => {
            return this.renderActionsColumn(data)
          }
        },
      ],
      defaultSort: [],
    }
    this.ConfirmDeleteDialog = null;
    this.toolbarActions = [
      {key: "create", path: "/drivers/create", icon: "add_circle_outline"},
      // {key: "exportCSV", path: null, icon: "cloud_download"},
      // {key: "print", path: null, icon: "local_printshop"},
    ];
    this.columnActions = [
      {key: "edit", path: "/drivers/edit", icon: "edit"},
      {key: "detail", path: "/drivers/detail", icon: "assignment"}
    ];
    this.renderToolbarActions = this.renderToolbarActions.bind(this)
    this.renderSelectedActions = this.renderSelectedActions.bind(this)
  }

  customCardNumColumn = (data) => {
    let driverCards = this.getData(data.row, 'driverCards', {});
    let deliverNumber = this.getData(driverCards, 'deliverNumber', 'N/A');
    let fuelNumber = this.getData(driverCards, 'fuelNumber', 'N/A');

    return (
      <ul style = {{paddingLeft:"15px"}}>
        <li>{I18n.t('Label.driver.fuelNumber')}: {fuelNumber}</li>
        <li>{I18n.t('Label.driver.deliverNumber')}: {deliverNumber}</li>
      </ul>
    )
  }

  render() {
    let {classes} = this.props;
    let drivers = this.getData(this.props, 'drivers', {})
    return (
      <PaperFade showLoading={true}>
        <GridTable
          id="DriverIndex"
          className={classes.gridTable}
          onFetchData={this.props.onFetchData}
          onRefTable={this.props.onRefTable}
          columns={this.table.columns}
          rows={[...drivers.list_data || []]}
          totalCount={drivers.total || 0}
          pageSize={drivers.limit || 20}
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
