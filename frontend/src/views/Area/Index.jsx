import React from 'react';
import PropTypes from 'prop-types';
import {withRouter} from 'react-router-dom';
import withStyles from '@material-ui/core/styles/withStyles';
import PaperFade from 'components/Main/PaperFade';
import BaseView from 'views/BaseView';
import {formatDateField} from 'config/constant';
import {I18n} from 'helpers/I18n';
import moment from 'moment';

moment.defaultFormat = formatDateField;
//import GridTable from 'components/Table/GridTable'
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
          width:90
        },
        {
          name: 'code',
          title: I18n.t('Table.area.code'),
          width: 150
        },
        {
          name: 'name',
          title: I18n.t('Table.area.name'),
          width: 500
        },
        {
          name: 'insert.when',
          title: I18n.t('Table.createdAt'),
          type: "date",
          filterFormat: "YYYY/MM/DD",
          defaultFilterOperation: "daterange",
          width: 300,
          formatterComponent: (data) => {
            return moment(data.value).format(formatDateField)
          },
        },
        {
          name: '_id',
          title: I18n.t('Table.action'),
          filterable: false,
          sortable: false,
          formatterComponent: (data) => {
            return this.renderActionsColumn(data)
          },
          width: 150
        },
      ],
      defaultSort: [],
    }
    this.ConfirmDeleteDialog = null;
    this.toolbarActions = [
      {key: "create", path: "/areas/create", icon: "add_circle_outline"},
      // {key: "exportCSV", path: null, icon: "cloud_download"},
      // {key: "print", path: null, icon: "local_printshop"},
    ];
    this.columnActions = [
      {key: "edit", path: "/areas/edit", icon: "edit"},
      // {key: "detail", path: "/areas/detail", icon: "assignment"}
    ];
    this.renderToolbarActions = this.renderToolbarActions.bind(this)
    this.renderSelectedActions = this.renderSelectedActions.bind(this)
  }

  render() {
    const {classes} = this.props
    let areas = this.getData(this.props, "areas", {});
    return (
      <PaperFade showLoading={true}>
        <GridTable
          id="CategoryIndex"
          className={classes.gridTable}
          onFetchData={this.props.onFetchData}
          onRefTable={this.props.onRefTable}
          columns={this.table.columns}
          rows={[...areas.list_data || []]}
          totalCount={areas.total || 0}
          pageSize={areas.pageSize || 20}
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
