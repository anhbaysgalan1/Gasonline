import React from 'react'
import PropTypes from 'prop-types'
import {withRouter} from 'react-router-dom'
import withStyles from '@material-ui/core/styles/withStyles'
import {Hidden} from '@material-ui/core'
import BaseView from 'views/BaseView'
import PaperFade from 'components/Main/PaperFade'
import DateTimeField from 'components/Forms/DateTimeField'
import DetailedExpansionPanel from './components/ExpansionPanels'
import IndexMobile from './IndexMobile'
import {dateFormatBackend, dateFormatDefault} from 'config/constant'
import {I18n} from 'helpers/I18n'
import moment from 'moment'
import _ from 'lodash'

moment.defaultFormat = dateFormatBackend;
// const GridTable = React.lazy(() => import('components/Table/GridTable'));

const styles = theme => ({
  gridTable: {
    overFlow: "auto",
  },
  paper: {
    [theme.breakpoints.up('md')]: {
      padding: `${theme.spacing.unit * 1}px ${theme.spacing.unit * 1}px `,
      textAlign: 'right'
    },
    padding: '5px 5px',
    margin: 0
  },
});

class Index extends BaseView {
  constructor(props) {
    super(props)
    this.state = {
      date: moment()
    }
    this.renderDateField = this.renderDateField.bind(this);
    this.onChangeDate = this.onChangeDate.bind(this);
  }

  onChangeDate(date) {
    this.setState({date: date});
    this.props.onFetchData({date: date.format()});
  }

  renderDateField() {
    const {classes} = this.props;
    let {date} = this.state;
    return (
      <DateTimeField
        label={I18n.t(`Input.order.deliveryDate`)}
        name="deliveryDate"
        format={dateFormatDefault}
        showTime={false}
        autoOk={true}
        value={date}
        onChange={this.onChangeDate}
        InputProps={{
          readOnly: true
        }}
        className={classes.dateField}
      />
    )
  }

  render() {
    const {trucks, onFetchData, classes} = this.props
    let checkExist = false
    if (!_.isEmpty(trucks)) {
      checkExist = true
    }
    return (
      <PaperFade showLoading={true} className={classes.paper}>
        <Hidden smUp>
          <IndexMobile
            classes={classes}
            trucks={trucks}
            onFetchData={onFetchData}
          />
        </Hidden>
        <Hidden xsDown>
          {this.renderDateField()}
          {
            checkExist
              ?
              trucks.map(truck => {
                return <DetailedExpansionPanel key={truck.id} truck={truck}/>
              })
              : ''
          }
        </Hidden>
      </PaperFade>
    )
  }
}

Index.propTypes = {
  classes: PropTypes.object.isRequired,
};

export default withStyles(styles)(withRouter(Index));
