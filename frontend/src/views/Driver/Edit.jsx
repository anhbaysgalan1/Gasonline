import React from 'react'
import PropTypes from 'prop-types';
import withStyles from '@material-ui/core/styles/withStyles';
import {Form, TextField, Validation} from 'components/Forms';
import {BaseView} from 'views/BaseView';
import {I18n} from 'helpers/I18n';
import {Button, Grid, Icon} from '@material-ui/core';
import PaperFade from "components/Main/PaperFade";
import { withRouter } from 'react-router-dom';

const styles = theme => ({
  button: {
    marginLeft: '5px'
  },
  sizeIcon: {
    fontSize: '15px'
  }
});


class Edit extends BaseView {
  constructor(props) {
    super(props)
    this.state = {}
    this.validate = {
      code: [
        Validation.required(I18n.t("Validate.required.base"))
      ],
      name: [
        Validation.required(I18n.t("Validate.required.base")),
      ],
      cardNum: [
        Validation.required(I18n.t("Validate.required.base")),
        Validation.min(1),
      ],
      phone: [
        Validation.required(I18n.t("Validate.required.base")),
        Validation.maxLength(12, I18n.t("Validate.phone.maxLength")),
        Validation.minLength(10, I18n.t("Validate.phone.minLength")),
      ]
    };
  }

  render() {
    const {classes, onSubmit} = this.props
    let driver = this.getData(this.props, 'driver', {});
    return (
      <PaperFade className={classes.paper}>
        <Form className={classes.form} onSubmit={onSubmit}>
          <Grid container spacing={4}>
            <Grid item xs={12} lg={6}>
              <TextField
                fullWidth
                type="text"
                label={I18n.t("Input.user.lastName")}
                name="lastName"
                value={driver.lastName}
                validate={this.validate.name}
              />
            </Grid>

            <Grid item xs={12} lg={6}>
              <TextField
                fullWidth
                type="text"
                label={I18n.t("Input.user.firstName")}
                name="firstName"
                value={driver.firstName}
                validate={this.validate.name}
              />
            </Grid>

            <Grid item xs={12} lg={6}>
              <TextField
                fullWidth
                type="email"
                label={I18n.t("Input.email")}
                name="email"
                value={driver.email}
                validate={this.validate.email}
              />
            </Grid>

            <Grid item xs={12} lg={6}>
              <TextField
                fullWidth
                type="text"
                label={I18n.t("Input.phone")}
                name="phone"
                value={driver.phone}
                validate={this.validate.phone}
                formatData={this.formatData}
              />
            </Grid>

            <Grid item xs={12} lg={6}>
              <TextField
                fullWidth
                type="text"
                label={I18n.t("Label.driver.fuelNumber")}
                name="driverCards.fuelNumber"
                value={this.getData(driver, 'driverCards.fuelNumber', '')}
                validate={this.validate.cardNum}
                formatData={this.formatData}
              />
            </Grid>

            <Grid item xs={12} lg={6}>
              <TextField
                fullWidth
                type="text"
                label={I18n.t("Label.driver.deliverNumber")}
                name="driverCards.deliverNumber"
                value={this.getData(driver, 'driverCards.deliverNumber', '')}
                validate={this.validate.cardNum}
                formatData={this.formatData}
              />
            </Grid>
          </Grid>
          <Grid item xs={12} container direction="row" justify="flex-end" alignItems="flex-end" spacing={2}>
            <Grid item>
              <Button size='small' variant="contained" color="primary" onClick={() => this.goto('/drivers')} >
                <Icon className={classes.sizeIcon}>arrow_back_ios</Icon>{I18n.t("Button.back")}
              </Button>
              <Button size='small' type="submit" variant="contained" color="primary" className={classes.button}>
                {I18n.t("Button.edit")}
              </Button>
            </Grid>
          </Grid>
        </Form>
      </PaperFade>
    )
  }
}

Edit.propTypes = {
  classes: PropTypes.object.isRequired,
};

export default withStyles(styles)(withRouter(Edit));
