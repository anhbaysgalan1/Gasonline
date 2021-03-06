import React, {Fragment} from 'react'
import PropTypes from 'prop-types'
import { withRouter } from 'react-router-dom'
import withStyles from '@material-ui/core/styles/withStyles'
import BaseView from 'views/BaseView'
import PaperFade from 'components/Main/PaperFade'
import IndexSky from './IndexSky'
import IndexMC from './IndexMC'
import FilterForm from './components/FilterForm'

const styles = theme => ({
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
  }

  onSubmit =(values) => {
    this.props.onFetchData(values)
  }

  setTypeViews = (type) => {
    this.setState({ type: type })
    this.setState({ reload: !this.state.reload })
  }

  render() {
    const { 
      classes, customers, invoices = {}, 
      loadUser, invoiceDate, filters, onExportFile
    } = this.props;
    let { type } = this.state
    
    return (
      <Fragment>
        <PaperFade showLoading={true}>
          <FilterForm
            customers={customers}
            onSubmit={this.onSubmit}
            loadUser={loadUser}
            setTypeViews={this.setTypeViews}
          />
        </PaperFade>
        {
          type == '1' ?
            <IndexSky
              classes={classes}
              data = {this.getData(invoices, "lists", [])}
              invoiceDate = {invoiceDate}
              onExportFile = {onExportFile}
              filters = {filters}
            />
            :
            <IndexMC
              classes={classes}
              data = {this.getData(invoices, "lists", [])}
              overAll = {this.getData(invoices, "total", {})}
              invoiceDate = {invoiceDate}
              onExportFile = {onExportFile}
              filters = {filters}
            />
        }
      </Fragment>
    )
  }
}

Index.propTypes = {
  classes: PropTypes.object.isRequired,
};

export default withStyles(styles)(withRouter(Index));
