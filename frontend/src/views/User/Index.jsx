import React from 'react';
import PropTypes from 'prop-types';
import withStyles from '@material-ui/core/styles/withStyles';
import { withRouter } from 'react-router-dom'
import { IconButton, Icon, Tooltip } from '@material-ui/core'
import BaseView from 'views/BaseView'
import PaperFade from 'components/Main/PaperFade';
import { I18n } from 'helpers/I18n';
import ConfirmDialog from 'components/Dialogs/ConfirmDialog'
import { city } from 'config/constant'

//moment.defaultFormat="DD/MM/YYYY"
//import GridTable from 'components/Table/GridTable'
const GridTable = React.lazy(() => import('components/Table/GridTable'))


const styles = theme => ({
  gridTable: {
    height: "calc(100vh - 90px)"
  }
});

class Index extends BaseView {
  constructor(props) {
    super(props)
    this.state = {
      rendered: false
    }
    this.table = {
      columns: [
        {
          name: 'code',
          title: "Mã",
          type: "text",
        },
        {
          name: 'name',
          title: "Đại lý",
          type: "text",
        },
        {
          name: 'phone',
          title: "Số điện thoại",
        },
        {
          name: 'city',
          title: "Tỉnh",
          type: "text",
          formatterComponent: (data) => {
            let cityObj = city.filter(element => element.code === data.value)
            return this.getData(cityObj, "0.name", "")
          }
        },
        {
          name: 'Group.name',
          title: "Cấp bậc",
          formatterComponent: (data) => {
            return this.getData(data, "row.Group.name", "")
          }
        },
        {
          name: 'Parent.name',
          title: "Cấp trên",
          formatterComponent: (data) => {
            return this.getData(data, "row.Parent.name", "")
          }
        },
        {
          name: '_id',
          title: I18n.t('Table.action'),
          filterable: false,
          formatterComponent: (data) => {
            return this.renderActionsColumn(data)
          }
        },
      ],
      defaultSort: [{ columnName: 'code', direction: 'asc' }],
    }
    this.ConfirmDialog = null

    this.renderToolbarActions = this.renderToolbarActions.bind(this)
    this.renderSelectedActions = this.renderSelectedActions.bind(this)
  }


  renderActionsColumn(data) {
    let _id = data.value || ''

    return [<IconButton onClick={() => this.goto(`/users/${_id}`)} key="edit">
      <Icon>edit</Icon>
    </IconButton>,
    <IconButton onClick={() => this.goto(`/users/${_id}/tree`)} key="tree">
      <Icon>device_hub</Icon>
    </IconButton>
    ]
  }

  renderToolbarActions() {
    return [
      <Tooltip title={I18n.t("Tooltip.create")} key="create">
        <IconButton onClick={() => this.goto("/users/create")}>
          <Icon>add_circle_outline</Icon>
        </IconButton>
      </Tooltip>
    ]
  }

  renderSelectedActions(selectedIds) {
    return [
      <Tooltip title={I18n.t("Tooltip.delete")} key="delete">
        <IconButton key="delete" onClick={() => this.ConfirmDialog.show(selectedIds)}>
          <Icon>delete</Icon>
        </IconButton>
      </Tooltip>
    ]
  }

  renderDialogConfirmDelete() {
    return <ConfirmDialog
      ref={(ref) => this.ConfirmDialog = ref}
      title={I18n.t('Confirm.delete')}
      content={I18n.t('Notification.delete')}
      onSubmit={this.props.onDeleteData}
    />
  }

  render() {
    let { data, classes } = this.props
    return (
      <PaperFade showLoading={true}>
        <GridTable
          id="UserIndex"
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
