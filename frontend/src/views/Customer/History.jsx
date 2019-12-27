import React from 'react';
import PropTypes from 'prop-types';
import withStyles from '@material-ui/core/styles/withStyles';
import {withRouter} from 'react-router-dom'
import moment from 'moment'
import {Chip, Grid, Icon, IconButton, Tooltip, Typography} from '@material-ui/core'
import BaseView from 'views/BaseView'
import PaperFade from 'components/Main/PaperFade';
import {I18n} from 'helpers/I18n';
import ConfirmDialog from 'components/Dialogs/ConfirmDialog'
import Customer from 'views/Order/components/Customer'
//moment.defaultFormat="DD/MM/YYYY"
//import GridTable from 'components/Table/GridTable'
const GridTable = React.lazy(() => import('components/Table/GridTable'))
const styles = theme => ({
  gridTable: {
    height: "calc(100vh - 200px)"
  }
});

class Index extends BaseView {
  constructor(props) {
    super(props)
    this.state = {}
    this.table = {
      columns: [
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
          name: 'products',
          filterable: false,
          title: I18n.t('Table.header.products'),
          formatterComponent: (data) => this.showProducts(data.value)
        },
        {
          name: 'total',
          filterable: false,
          title: I18n.t('Table.header.totalAmount'),
          formatterComponent: (data) => {
            let result = []
            if (data.row.discount) {
              result.push(<s>{data.row.total}K</s>)
              result.push(<br/>)
            }
            result.push(`${data.row.total - data.row.discount}K`)
            return result
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
      defaultSort: [],
    }
    this.ConfirmDialog = null

    this.renderToolbarActions = this.renderToolbarActions.bind(this)
    this.renderSelectedActions = this.renderSelectedActions.bind(this)
  }

  showProducts = (products) => {
    products = products.map(product => <div key={product._id}>
      <Chip
        label={product.name}
      />
    </div>)
    return <div>{products}</div>
  }

  renderActionsColumn(data) {
    let _id = data.value || ''
    return <IconButton onClick={() => this.goto(`/orders/${_id}`)}>
      <Icon>edit</Icon>
    </IconButton>
  }

  renderToolbarActions() {
    return [
      <Tooltip title={I18n.t("Tooltip.create")} key="create">
        <IconButton onClick={() => this.goto(`/orders/create/?customerId=${this.props.customer._id}`)}>
          <Icon>add_circle_outline</Icon>
        </IconButton>
      </Tooltip>,
      <Tooltip title={I18n.t("Tooltip.exportCSV")} key="export">
        <IconButton>
          <Icon>cloud_download</Icon>
        </IconButton>
      </Tooltip>,
      <Tooltip title={I18n.t("Tooltip.print")} key="print">
        <IconButton>
          <Icon>local_printshop</Icon>
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
    const {data, classes} = this.props
    return (<React.Fragment>
        <Grid container>
          <Grid item xs={12} lg={4}>
            <Customer
              readOnly={true}
              data={this.props.customer}
            />
          </Grid>
          <Grid item xs={12} lg={8}>
            <PaperFade showLoading={true}>
              <Typography variant="h6">{I18n.t("Label.order")}</Typography>
              <GridTable
                id="OrderIndex"
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
          </Grid>
        </Grid>
      </React.Fragment>
    )
  }
}

Index.propTypes = {
  classes: PropTypes.object.isRequired,
};

export default withStyles(styles)(withRouter(Index));
