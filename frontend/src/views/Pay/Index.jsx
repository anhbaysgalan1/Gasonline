import React from 'react'
import PropTypes from 'prop-types'
import { withRouter } from 'react-router-dom'
import withStyles from '@material-ui/core/styles/withStyles'
import { Chip, Typography, Grid, Card, CardContent, CardActions } from '@material-ui/core'
import BaseView from 'views/BaseView'
import PaperFade from 'components/Main/PaperFade'
import SelectField, { Option } from 'components/Forms/SelectField'
import Utils from 'helpers/utility'
import { I18n } from 'helpers/I18n'
import IndexSky from './IndexSky'
import IndexMC from './IndexMC'
import FilterForm from './components/FilterForm'

const GridTable = React.lazy(() => import('components/Table/GridTable'))
const styles = theme => ({
  // gridTable: {
  //   overFlow: "auto",
  //   height: 'calc(82vh)'
  // },
  driverName: {
    color: theme.palette.secondary.main,
    fontWeight: "500"
  },
  fixColumn: {
    whiteSpace: 'normal',
  },
})

class Index extends BaseView {
  constructor(props) {
    super(props)
    this.state = {
      type: '1',
      reload: false
    }
    this.getTypeViews = this.getTypeViews.bind(this)
  }

  onSubmit =(values) => {
    this.month = values.month
    this.props.onFetchData(values)
  }

  getTypeViews(type){
    this.setState({ type: type })
    this.setState({ reload: !this.state.reload })
  }

  render() {
    const { classes, customers, invoices = {}, loadUser, invoiceDate, filters } = this.props;
    console.log("xxx", filters)
    let { type } = this.state
    return (<React.Fragment>
      <PaperFade showLoading={true}>
        <FilterForm
          customers={customers}
          onSubmit={this.onSubmit}
          loadUser={loadUser}
          getTypeViews={this.getTypeViews}
        />
      </PaperFade>
      {
        type == '1' ?
          <IndexSky
            classes={classes}
            data = {this.getData(invoices, "lists", [])}
            invoiceDate = {invoiceDate}
          />
          :
          <IndexMC
            classes={classes}
            data = {this.getData(invoices, "lists", [])}
            overAll = {this.getData(invoices, "total", {})}
            invoiceDate = {invoiceDate}
            filters = {filters}
          />
      }
    </React.Fragment>
    )
  }
}

Index.propTypes = {
  classes: PropTypes.object.isRequired,
};

export default withStyles(styles)(withRouter(Index));
