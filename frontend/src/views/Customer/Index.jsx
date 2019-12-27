import React from 'react';
import PropTypes from 'prop-types';
import {withRouter} from 'react-router-dom';
import {Fab, Icon, IconButton, Tooltip, Zoom} from '@material-ui/core';
import withStyles from '@material-ui/core/styles/withStyles';
import NavigationIcon from '@material-ui/icons/Navigation';
import ConfirmDialog from 'components/Dialogs/ConfirmDialog';
import PaperFade from 'components/Main/PaperFade';
import SelectField, {Option} from 'components/Forms/SelectField';
import TextField from 'components/Forms/TextField';
import BaseView from 'views/BaseView'
import {customerTypes} from 'config/constant';
import {I18n} from 'helpers/I18n';

const GridTable = React.lazy(() => import('components/Table/GridTable'))
const styles = theme => ({
  margin: {
    margin: theme.spacing(1),
  },
  extendedIcon: {
    marginRight: theme.spacing(1),
  },
  input: {
    transition: "backgroundColor 2s linear"
  },
  underline: {
    backgroundColor: "#b3e5fc",
  }
});

class Index extends BaseView {
  constructor(props) {
    super(props)
    this.state = {
      isEditing: false,
    }
    this.listEditing = [];
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
          name: 'code',
          title: I18n.t('Table.customer.code'),
          width: 120
        },
        {
          name: 'name',
          title: I18n.t('Table.customer.name'),
          width: 220,
        },
        {
          name: 'phone',
          title: I18n.t('Table.phone'),
          width: 130
        },
        {
          name: 'address',
          title: I18n.t('Table.address'),
          width: 275
        },
        {
          name: 'type',
          title: I18n.t('Table.customer.type'),
          type: "number",
          defaultFilterOperation: "equal",
          width: 150,
          formatterComponent: (data) => {
            return I18n.t(`Label.customer.mapTypeValue.${data.value}`);
          },
          availableFilterOperations: [],
          editorComponent: ({value, onValueChange}) => this.customFilterTypeColumn({value, onValueChange})
        },
        {
          name: 'extraPrice',
          title: I18n.t('Table.customer.extendPrice'),
          filterable: false,
          width: 150,
          formatterComponent: (data) => {
            return this.customUnitPriceColumn(data);
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
    this.ConfirmSubmitDialog = null;
    this.ConfirmDeleteDialog = null;
    this.toolbarActions = [
      {key: "create", path: "/customers/create", icon: "add_circle_outline"},
      {key: "exportCSV", path: null, icon: "cloud_download"},
      {key: "print", path: null, icon: "local_printshop"},
    ];
    this.columnActions = [
      {key: "edit", path: "/customers/edit", icon: "edit"},
      {key: "detail", path: "/customers/detail", icon: "assignment"}
    ];
    this.renderToolbarActions = this.renderToolbarActions.bind(this)
    this.renderSelectedActions = this.renderSelectedActions.bind(this);
    this.onEdit = this.onEdit.bind(this);
  }

  onEdit() {
    const {isEditing} = this.state;
    if (isEditing && this.listEditing.length) {
      this.ConfirmSubmitDialog.show(this.listEditing);
    }
    this.setState({isEditing: !isEditing});
  }

  onChangeUnitPrice(value, data) {
    let index = this.listEditing.findIndex(item => Number(item.id) === Number(data.row.id));
    if (index === -1) {
      this.listEditing.push({...data.row, extraPrice: value})
    } else {
      this.listEditing[index].extraPrice = value;
    }
  }

  customUnitPriceColumn(data) {
    const {classes} = this.props;
    return (
      <TextField
        name="extraPrice"
        value={data.value}
        InputProps={{
          classes: {
            underline: classes.underline
          },
          // readOnly: !this.state.isEditing,
          disabled: !this.state.isEditing,
          disableUnderline: !this.state.isEditing,

        }}
        onChange={value => this.onChangeUnitPrice(value, data)}
        formatData={this.formatData}
      />
    )
  }

  customFilterTypeColumn = ({value, onValueChange}) => (
    <SelectField
      value={value}
      onChange={onValueChange}
      fullWidth
    >
      <Option value="">{I18n.t("Label.all")}</Option>
      {
        customerTypes.map(item => <Option value={item.value} key={item.value}>{item.label}</Option>)
      }
    </SelectField>
  )

  renderToolbarActions() {
    const {classes} = this.props;
    const {isEditing} = this.state;
    const transitionDuration = {
      enter: 150,
      exit: 150,
    };
    return (
      <React.Fragment>
        {!isEditing ?
          <Zoom in={!isEditing} unmountOnExit timeout={transitionDuration}
                style={{transitionDelay: `${!isEditing ? transitionDuration.exit : 0}ms`}}
          >
            <Tooltip title={I18n.t("Tooltip.editPrice")} key="edit">
              <Fab variant="extended" size="small" color="primary" aria-label="add" className={classes.margin}
                   onClick={this.onEdit}
              >
                <NavigationIcon className={classes.extendedIcon}/>
                {I18n.t("Button.edit")}
              </Fab>
            </Tooltip>
          </Zoom>
          :
          <Zoom in={isEditing} timeout={transitionDuration} unmountOnExit
                style={{transitionDelay: `${isEditing ? transitionDuration.exit : 0}ms`}}
          >
            <Tooltip title={I18n.t("Tooltip.updatePrice")} key="submit">
              <Fab
                variant="extended"
                size="small"
                color="primary"
                aria-label="add"
                className={classes.margin}
                onClick={this.onEdit}
              >
                <NavigationIcon className={classes.extendedIcon}/>
                {I18n.t("Button.update")}
              </Fab>
            </Tooltip>
          </Zoom>
        }
        <Tooltip title={I18n.t("Tooltip.create")} key="create">
          <IconButton onClick={() => this.goto("/customers/create")}>
            <Icon>add_circle_outline</Icon>
          </IconButton>
        </Tooltip>
      </React.Fragment>)
  }

  renderDialogConfirmUpdate() {
    return <ConfirmDialog
      ref={(ref) => this.ConfirmSubmitDialog = ref}
      title={I18n.t('Confirm.updatePrice')}
      content={I18n.t('Notification.update')}
      onCancel={() => window.location.reload()}
      onSubmit={data => {
        this.props.onSubmitData(data);
        this.listEditing = [];
      }}
    />
  }

  render() {
    const {classes} = this.props;
    let customers = this.getData(this.props, "customers", {});
    return (
      <PaperFade showLoading={true}>
        <GridTable
          id="CustomerIndex"
          onFetchData={this.props.onFetchData}
          onRefTable={this.props.onRefTable}
          columns={this.table.columns}
          rows={[...customers.list_data || []]}
          totalCount={customers.total || 0}
          pageSize={customers.pageSize || 20}
          defaultSort={this.table.defaultSort}
          showCheckboxColumn={true}
          height="25px"
          selectedActions={this.renderSelectedActions}
          tableActions={this.renderToolbarActions}
        />
        {this.renderDialogConfirmUpdate()}
        {this.renderDialogConfirmDelete()}
        {/* được render luôn từ đầu, nhưng chưa show */}
      </PaperFade>
    )
  }
}

Index.propTypes = {
  classes: PropTypes.object.isRequired,
};

export default withStyles(styles)(withRouter(Index));
