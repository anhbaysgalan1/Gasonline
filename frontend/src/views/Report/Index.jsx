import React from 'react'
import PropTypes from 'prop-types';
import withStyles from '@material-ui/core/styles/withStyles';
import withWidth, { isWidthUp } from '@material-ui/core/withWidth';
import { Form, DateTimeField, Validation } from 'components/Forms'
import { BaseView } from 'views/BaseView';
import { I18n } from 'helpers/I18n';
import { Grid, Button, Typography } from '@material-ui/core';
import PaperFade from "components/Main/PaperFade";
import { Link } from 'react-router-dom';
import moment from 'moment';

const styles = theme => ({
  labelChooseDate: {
    lineHeight: "56px",    
  },
  calendar: {
    display: "inline-block",
    borderRadius: "5px",
    border: "1px solid #e8e8e8"
  }
});

class Index extends BaseView {
  constructor(props) {
    super(props);
    this.state = {
      date: moment()
    }
  }

  invalidDate(value){
    if(moment(value).format("YYYY-MM-DD") == "Invalid date")
      return I18n.t("Validate.dateInvalid")
  }

  render() {
    const { classes, viewReport } = this.props;
    let fullScreen = !isWidthUp('sm', this.props.width);
    let dateSelected = moment(this.state.date).format("YYYY-MM-DD")
    return (
      <PaperFade>
        <Form className={classes.form} >
          <Grid container spacing={4} direction='row' justify='flex-start' alignItems='flex-end' >
            <Grid item xs={12} md={2} >
              <Typography className={classes.labelChooseDate}>{I18n.t("Label.chooseDate")}</Typography>
            </Grid>
            <Grid item xs={12} md={4} >
              <DateTimeField
                name="date"
                variant="inline"
                format="YYYY/MM/DD"
                label={I18n.t('Input.date')}

                showTime={false}
                validate={[
                  Validation.required(I18n.t("Validate.required.base")),
                  this.invalidDate
                ]}
                onChange={value => this.setState({date: value})}
                orientation="landscape"
                fullWidth
              />
            </Grid>
            <Grid item xs={12} md={6} ></Grid>
            <Grid item xs={12} align="right">
                <Button variant="contained" color="primary" size='small'
                  disabled={this.invalidDate(this.state.date)}
                  onClick={() => viewReport(this.state.date)}>{I18n.t("Button.confirm")}
                </Button>
            </Grid>
          </Grid>
        </Form>
      </PaperFade>
    )
  }
}

Index.propTypes = {
  classes: PropTypes.object.isRequired,
};

export default withWidth()(withStyles(styles)(Index));
