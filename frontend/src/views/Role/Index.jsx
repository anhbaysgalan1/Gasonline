import Chip from '@material-ui/core/Chip';
import React from 'react';
import PropTypes from 'prop-types';
import withStyles from '@material-ui/core/styles/withStyles';
import { withRouter } from 'react-router-dom'
import moment from 'moment'
import { IconButton, Icon, Tooltip } from '@material-ui/core'
import BaseView from 'views/BaseView'
import PaperFade from 'components/Main/PaperFade';
import { I18n } from 'helpers/I18n';
import ConfirmDialog from 'components/Dialogs/ConfirmDialog'
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
    this.state = {
    }
    this.table = {
      columns: [
        {
          name: 'name',
          title: I18n.t('Table.header.role.name'),
          filterable: false
        },
        {
          name: 'Permission',
          title: I18n.t('Table.header.role.permission'),
          formatterComponent: (data) =>{
            return this.customPermissionColumn(data)
          }
        },
        {
          name: 'User',
          title: I18n.t('Table.header.role.userCount'),
          formatterComponent: (data) =>{
            return this.customUserColumn(data)
          },
          filterable: false
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
          formatterComponent: (data) =>{
            return this.renderActionsColumn(data)
          }
        },
      ],
      defaultSort: [],
    }
    this.ConfirmDialog = null

    this.renderToolbarActions = this.renderToolbarActions.bind(this)
    this.renderSelectedActions = this.renderSelectedActions.bind(this)
  }

  customPermissionColumn(data){
    data = data.value || []
    return data.map(element => (
      <Chip key={element._id} label={element.name} />
    ))
  }

  customUserColumn(data){
    data = data.value || []
    return data.length
  }

  renderActionsColumn(data){
    let _id = data.value || ''
    return <IconButton onClick={() => this.goto(`/roles/${_id}`)}>
      <Icon>edit</Icon>
    </IconButton>
  }

  renderToolbarActions() {
    return [
      <Tooltip title={I18n.t("Tooltip.create")} key="create">
        <IconButton onClick={() => this.goto("/roles/create")}>
          <Icon>add_circle_outline</Icon>
        </IconButton>
      </Tooltip>
    ]
  }

  renderSelectedActions(selectedIds){
    return [
      <Tooltip title={I18n.t("Tooltip.delete")} key="delete">
        <IconButton key="delete" onClick={() => this.ConfirmDialog.show(selectedIds)}>
          <Icon>delete</Icon>
        </IconButton>
      </Tooltip>
    ]
  }

  renderDialogConfirmDelete(){
    return <ConfirmDialog
      ref = {(ref) => this.ConfirmDialog = ref}
      title={I18n.t('Confirm.delete')}
      content={I18n.t('Notification.delete')}
      onSubmit={this.props.onDeleteData}
    />
  }

  render() {
    const { data, classes } = this.props
    return (
      <PaperFade showLoading={true}>
        <GridTable
          id="RoleIndex"
          className={classes.gridTable}
          onFetchData={this.props.onFetchData}
          onRefTable= {this.props.onRefTable}
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
