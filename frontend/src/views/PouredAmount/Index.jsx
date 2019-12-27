import React from 'react';
import PropTypes from 'prop-types';
import {
  ExpansionPanel,
  ExpansionPanelDetails,
  ExpansionPanelSummary,
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableRow,
  Typography,
} from '@material-ui/core';
import withStyles from '@material-ui/core/styles/withStyles';
import ExpandMoreIcon from '@material-ui/icons/ExpandMore';
import DateTimeField from 'components/Forms/DateTimeField';
import PaperFade from 'components/Main/PaperFade';
import {BaseView} from 'views/BaseView';
import ElementForm from './components/InputForm';
import {dateFormatBackend, dateFormatDefault, dateTimeFormatDefault, fuelProducts} from "config/constant";
import {I18n} from 'helpers/I18n';
import moment from 'moment';

moment.defaultFormat = dateFormatBackend;

const styles = theme => ({
  paper: {
    [theme.breakpoints.down('xs')]: {
      padding: '8px 8px',
      margin: 0
    },
  },
})

class Index extends BaseView {
  constructor(props) {
    super(props)
    this.state = {
      date: moment()
    }
    this.onChangeDate = this.onChangeDate.bind(this);
  }

  onChangeDate(date) {
    this.setState({date: date})
    this.props.onFetchData(date.format());
  }

  renderFilterDate() {
    let {date} = this.state;
    return (
      <DateTimeField
        label={I18n.t(`Placeholder.filter.date`)}
        name="date"
        format={dateFormatDefault}
        showTime={false}
        autoOk={true}
        value={date}
        onChange={this.onChangeDate}
        InputProps={{
          readOnly: true
        }}
        style={{
          marginTop: 0
        }}
      />
    )
  }

  renderHistory() {
    const {classes, histories} = this.props;
    if (!histories.length) return '';

    return histories.map((item, index) => {
      let orderDetails = this.getData(item, 'details', [])
      let time = this.getData(item, 'insert.when', null);
      if (time) time = moment(time).format(dateTimeFormatDefault);

      return (
        <ExpansionPanel key={index}>
          <ExpansionPanelSummary expandIcon={<ExpandMoreIcon/>}>
            <Typography color={"primary"}>{index + 1}- {time}</Typography>
          </ExpansionPanelSummary>

          <ExpansionPanelDetails>
            <Table className={classes.paper}>
              <TableHead className={classes.paper}>
                <TableRow>
                  {
                    fuelProducts.map(fuel =>
                      <TableCell align='center' className={classes.paper} key={fuel}>
                        {I18n.t(`Label.products.${fuel}`)}
                      </TableCell>
                    )
                  }
                </TableRow>
              </TableHead>

              <TableBody className={classes.paper}>
                <TableRow key={index}>
                  {
                    orderDetails.map(detail =>
                      <TableCell key={detail.material} align='center' className={classes.paper}>
                        {this.getData(detail, 'quantity', 0)}
                      </TableCell>
                    )
                  }
                </TableRow>
              </TableBody>
            </Table>
          </ExpansionPanelDetails>
        </ExpansionPanel>
      )
    })
  }

  render() {
    const {classes, onSubmit} = this.props

    return (
      <PaperFade className={classes.paper}>
        {this.renderFilterDate()}
        <br/>
        <div>{this.renderHistory()}</div>
        <br/>
        <ElementForm
          classes={classes}
          onSubmit={onSubmit}
        />
      </PaperFade>
    )
  }
}

Index.propTypes = {
  classes: PropTypes.object.isRequired,
};

export default withStyles(styles)(Index);
