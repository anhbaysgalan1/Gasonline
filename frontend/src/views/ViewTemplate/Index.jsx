import React from 'react';
import PropTypes from 'prop-types';
import withStyles from '@material-ui/core/styles/withStyles';
import {withRouter} from 'react-router-dom'
import moment from 'moment'
import BaseView from 'views/BaseView'
import PaperFade from 'components/Main/PaperFade';
import {I18n} from 'helpers/I18n';
//moment.defaultFormat="DD/MM/YYYY"
//import GridTable from 'components/Table/GridTable'
const GridTable = React.lazy(() => import('components/Table/GridTable'))
const styles = theme => ({
  gridTable: {
    height: "calc(100vh - 150px)"
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
          formatterComponent: (data) => {
            return this.textLink(data.value, `/__URLNAME__/${data.row._id}`)
          }
        },
        {
          name: 'name',
          title: I18n.t('Table.name'),
        },
        {
          name: 'insert.when',
          title: I18n.t('Table.createdAt'),
          type: "date",
          filterFormat: "DD/MM/YY",
          defaultFilterOperation: "daterange",
          formatterComponent: (data) => {
            return moment(data.value).format("HH:mm DD/MM/YYYY")
          },
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
      {key: "create", path: "/__URLNAME__/create", icon: "add_circle_outline"},
      {key: "exportCSV", path: null, icon: "cloud_download"},
      {key: "print", path: null, icon: "local_printshop"},
    ];
    this.columnActions = [
      {key: "edit", path: "/__URLNAME__/edit", icon: "edit"},
      {key: "detail", path: "/__URLNAME__/detail", icon: "assignment"}
    ];
    this.renderToolbarActions = this.renderToolbarActions.bind(this)
    this.renderSelectedActions = this.renderSelectedActions.bind(this)
  }

  render() {
    const {data, classes} = this.props
    return (
      <PaperFade showLoading={true}>
        <GridTable
          id="__COMPONENTNAME__Index"
          className={classes.gridTable}
          onFetchData={this.props.onFetchData}
          onRefTable={this.props.onRefTable}
          columns={this.table.columns}
          rows={data.data}
          totalCount={data.total}
          pageSize={data.pageSize}
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
