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
          width: 80
        },
        {
          name: 'name',
          title: I18n.t('Table.vehicle.name'),
          width: 210
        },
        {
          name: 'licensePlate',
          title: I18n.t('Table.vehicle.licensePlate'),
          width: 200
        },
        {
          name: 'driver.fullName',
          title: I18n.t('Table.vehicle.driver'),
          width: 210,
          formatterComponent: (data) => {
            return this.customDriverColumn(data)
          }
        },
        {
          name: 'capacity',
          filterable: false,
          sortable: false,
          width: 210,
          title: I18n.t('Table.vehicle.capacity'),
          formatterComponent: (data) => {
            return this.customFuelsColumn(data)
          }
        },
        {
          name: 'remain',
          filterable: false,
          sortable: false,
          width: 210,
          title: I18n.t('Table.vehicle.remaining'),
          formatterComponent: (data) => {
            return this.customFuelsColumn(data)
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
      {key: "create", path: "/vehicles/create", icon: "add_circle_outline"},
      // {key: "exportCSV", path: null, icon: "cloud_download"},
      // {key: "print", path: null, icon: "local_printshop"},
    ];
    this.columnActions = [
      {key: "edit", path: "/vehicles/edit", icon: "edit"},
      {key: "detail", path: "/vehicles/detail", icon: "assignment"}
    ];
    this.renderToolbarActions = this.renderToolbarActions.bind(this)
    this.renderSelectedActions = this.renderSelectedActions.bind(this)
  }

  customFuelsColumn = (data) => {
    const capacity = this.getData(data.row, "capacity", {})
    const remain = this.getData(data.row, "remain", {})
    let results = []
    switch (data.column.name) {
      case "capacity":
        if (Object.keys(capacity).length) {
          for (let fuel in capacity) {
            results.push(<li key={fuel}>{I18n.t(`Label.products.${fuel}`)}: {capacity[fuel] || 0} L</li>)
          }
        }
        break;
      case "remain":
        if (Object.keys(remain).length) {
          for (let fuel in remain) {
            results.push(<li key={fuel}>{I18n.t(`Label.products.${fuel}`)}: {remain[fuel] || 0} L</li>)
          }
        }
        break;
      default:
        break;
    }
    return <ul style={{paddingLeft: '15px'}}>{results}</ul>
  }

  customDriverColumn = (data) => {
    let driver = data.value || this.getData(data.row, 'driver.fullName', 'N/A')
    return <p>{driver}</p>
  }

  render() {
    const {classes} = this.props;
    let vehicles = this.getData(this.props, 'vehicles', {})
    return (
      <PaperFade showLoading={true}>
        <GridTable
          id="TruckIndex"
          className={classes.gridTable}
          onFetchData={this.props.onFetchData}
          onRefTable={this.props.onRefTable}
          columns={this.table.columns}
          rows={vehicles.list_data || []}
          totalCount={vehicles.total || 0}
          pageSize={vehicles.limit || 20}
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
