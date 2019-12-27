import React, {PureComponent} from 'react';
import {Icon, IconButton, Tooltip} from "@material-ui/core";
import {FontAwesomeIcon} from "@fortawesome/react-fontawesome";
import {faTruckPickup} from "@fortawesome/free-solid-svg-icons";
import ConfirmDialog from 'components/Dialogs/ConfirmDialog';
import {dateFormatDefault} from 'config/constant';
import Utils from 'helpers/utility';
import {I18n} from 'helpers/I18n';
import moment from 'moment';

moment.defaultFormat = dateFormatDefault;

class BaseView extends PureComponent {

  formatData = (value) => {
    return Utils._formatData(value)
  }

  getData = (obj, path, defaultValue = undefined) => {
    return Utils._getData(obj, path, defaultValue)
  }

  goto(path, params = undefined) {
    if (!this.props.history) {
      return console.error("need export with withRouter() to redirect page.")
    }
    if (params) {
      return this.props.history.push({
        pathname: path,
        params: params
      });
    }
    return this.props.history.push(path)
  }

  textLink(text, path) {
    return (
      <div onClick={() => this.goto(path)} style={{cursor: "pointer"}}>
        {text}
      </div>
    )
  }

  renderDialogConfirmDelete() {
    return <ConfirmDialog
      ref={(ref) => this.ConfirmDeleteDialog = ref}
      title={I18n.t('Confirm.delete')}
      content={I18n.t('Notification.delete')}
      onSubmit={this.props.onDeleteData}
    />
  }

  renderSelectedActions(selectedIds) {
    return [
      <Tooltip title={I18n.t("Tooltip.delete")} key="delete">
        <IconButton key="delete" onClick={() => this.ConfirmDeleteDialog.show(selectedIds)}>
          <Icon>delete</Icon>
        </IconButton>
      </Tooltip>
    ]
  }

  renderToolbarActions() {
    return this.toolbarActions.map(item => {
      return (
        <Tooltip title={I18n.t(`Tooltip.${item.key}`)} key={item.key}>
          <IconButton onClick={() => this.goto(item.path)}>
            <Icon>{item.icon}</Icon>
          </IconButton>
        </Tooltip>
      )
    })
  }

  renderActionsColumn(data) {
    let _id = data.value || '';
    return this.columnActions.map(item => {
      if (item.key === "shareOrder") {
        let params = {id: _id, deliveryDate: data.row.deliveryDate};
        return (
          data.row.status === 1 &&
          <Tooltip title={I18n.t(`Tooltip.${item.key}`)} key={item.key}>
            <IconButton onClick={() => this.goto(item.path, params)}>
              <FontAwesomeIcon icon={faTruckPickup} size="xs"></FontAwesomeIcon>
            </IconButton>
          </Tooltip>
        )
      }
      return (
        <Tooltip title={I18n.t(`Tooltip.${item.key}`)} key={item.key}>
          <IconButton onClick={() => this.goto(`${item.path}/${_id}`)}>
            <Icon>{item.icon}</Icon>
          </IconButton>
        </Tooltip>
      )
    })

    // return (
    //   <React.Fragment>
    //     {
    //       this.columnActions.map(item => {
    //         return (
    //           <Tooltip title={I18n.t(`Tooltip.${item.key}`)} key={item.key}>
    //             <IconButton onClick={() => this.goto(`${item.path}/${_id}`)}>
    //               <Icon>{item.icon}</Icon>
    //             </IconButton>
    //           </Tooltip>
    //         )
    //       })
    //     }
    //   </React.Fragment>
    // )
  }

  renderDataField(data, field = null, dataType = null) {
    let value = data.value || '';
    if (field) value = this.getData(data.row, field, '');
    if (dataType === 'date' && value) value = moment(value).format();
    return value
  }
}

export {BaseView}
export default BaseView
