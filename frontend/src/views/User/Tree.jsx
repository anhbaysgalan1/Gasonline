import React from 'react';
import PropTypes from 'prop-types';
import withStyles from '@material-ui/core/styles/withStyles';
import { withRouter } from 'react-router-dom'
import { IconButton, Icon, Tooltip } from '@material-ui/core'
import BaseView from 'views/BaseView'
import PaperFade from 'components/Main/PaperFade';
import { I18n } from 'helpers/I18n';
import ConfirmDialog from 'components/Dialogs/ConfirmDialog'

//moment.defaultFormat="DD/MM/YYYY"
//import GridTable from 'components/Table/GridTable'
const GridTable = React.lazy(() => import('components/Table/GridTableTreeView'))


const styles = theme => ({
  gridTable: {
    height: "calc(100vh - 90px)"
  },
  highlight: {
    color: "#ffffff",
    background: "#2196f3",
    padding: "5px 20px",
    "& .group": {
      color: "#ffffff",
    }
  },
  group: {
    fontSize: "11px",
    fontStyle: "italic",
    color: "#b7b7b7"
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
          name: 'name',
          title: "Đại lý",
          type: "text",
          formatterComponent: (data) => {
            let result = []
            const {classes} = this.props
            let user = this.props.user
            let classWrap = ""
            if(user._id === data.row._id) classWrap = classes.highlight

            result.push(`${this.getData(data,"row.code", "")} - ${this.getData(data,"row.name")}`)
            result.push(<div key="Group" className={`${classes.group} group`}>{this.getData(data, "row.Group.name")}</div>)
            return this.textLink(<div className={classWrap}>{result}</div>, `/users/${data.row._id}/tree`)
          },
          width: "300"
        }
      ],
      defaultSort: [{ columnName: 'code', direction: 'asc' }],
    }
    this.ConfirmDialog = null

    this.renderToolbarActions = this.renderToolbarActions.bind(this)
    this.renderSelectedActions = this.renderSelectedActions.bind(this)
  }


  renderActionsColumn(data){
    let _id = data.value || ''
    return <IconButton onClick={() => this.goto(`/users/${_id}`)}>
      <Icon>edit</Icon>
    </IconButton>
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
  getDefaultExpandedRowIds(){
    let {data, user} = this.props
    data = data.filter(u => u.level <= user.level)
    if(data)
      return data.map(user => user._id)
    return []
  }
  render() {
    let { data, classes, user } = this.props
    if(data.length > 0 && user._id === this.props.match.params.id)
    return (
      <PaperFade showLoading={true}>
        <GridTable
          id="UserIndex"
          className={classes.gridTable}
          onFetchData={this.props.onFetchData}
          onRefTable= {this.props.onRefTable}
          columns={this.table.columns}
          rows={data || []}
          totalCount={data.total}
          pageSize={data.pageSize}
          defaultSort={this.table.defaultSort}
          showCheckboxColumn={true}
          height="auto"
          selectedActions={this.renderSelectedActions}
          tableActions={this.renderToolbarActions}
          defaultExpandedRowIds={this.getDefaultExpandedRowIds()}
        />
      </PaperFade>
    )
    return ""
  }
}

Index.propTypes = {
  classes: PropTypes.object.isRequired,
};

export default withStyles(styles)(withRouter(Index));
