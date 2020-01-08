import React from 'react'
import PropTypes from 'prop-types';
import {withRouter} from 'react-router-dom';
import withStyles from '@material-ui/core/styles/withStyles';
import {Button, Grid, Icon} from '@material-ui/core';
import PaperFade from "components/Main/PaperFade";
import {Form, TextField, Validation} from 'components/Forms';
import {BaseView} from 'views/BaseView';
import {I18n} from 'helpers/I18n';

const styles = theme => ({
  button: {
    marginLeft: '5px'
  },
  sizeIcon: {
    fontSize: '15px'
  }
});

class Create extends BaseView {
  constructor(props) {
    super(props)
    this.state = {
      isError: false
    };
    this.confirmPass = {
      password: "",
      rePassword: ""
    }
    this.validate = {
      name: [
        Validation.required(I18n.t("Validate.required.base")),
        Validation.maxLength(255, I18n.t("Validate.maxLength")),
      ],
      cardNum: [
        Validation.required(I18n.t("Validate.required.base")),
        Validation.min(1),
      ],
      phone: [
        Validation.required(I18n.t("Validate.required.base")),
        Validation.maxLength(13, I18n.t("Validate.phone.maxLength")),
        Validation.minLength(10, I18n.t("Validate.phone.minLength")),
      ],
      password: [
        Validation.required(I18n.t("Validate.required.base")),
      ],
      rePassword: [
        Validation.required(I18n.t("Validate.required.base")),
      ],
      email: [
        Validation.required(I18n.t("Validate.required.base")),
        Validation.validateEmail(I18n.t("Validate.email.format"))
      ]
    };
  }

  onChange(value, name) {
    this.confirmPass[name] = value;
    if (this.confirmPass.password && this.confirmPass.rePassword && this.confirmPass.password !== this.confirmPass.rePassword) {
      this.setState({isError: true});
    } else {
      this.setState({isError: false});
    }
  }

  phoneFormatter = (number) => {
    number = number.replace(/[^\d]/g, '')
    if (number.length == 4) {
      number = number.replace(/(\d{4})/, "$1")
    } else if (number.length == 5) {
      number = number.replace(/(\d{4})(\d{1})/, "$1-$2")
    } else if (number.length == 6) {
      number = number.replace(/(\d{4})(\d{2})/, "$1-$2")
    } else if (number.length == 7) {
      number = number.replace(/(\d{4})(\d{3})/, "$1-$2")
    } else if (number.length == 8) {
      number = number.replace(/(\d{4})(\d{3})(\d{1})/, "$1-$2-$3")
    } else if (number.length == 9) {
      number = number.replace(/(\d{4})(\d{3})(\d{2})/, "$1-$2-$3")
    } else if (number.length == 10) {
      number = number.replace(/(\d{4})(\d{3})(\d{3})/, "$1-$2-$3")
    } else if (number.length == 11) {
      number = number.replace(/(\d{3})(\d{4})(\d{4})/, "$1-$2-$3")
    } else if (number.length > 11) {
      number = number.substring(0, 11)
      number = number.replace(/(\d{3})(\d{4})(\d{4})/, "$1-$2-$3")
    }
    return number
  }

  render() {
    const {classes, onSubmit} = this.props
    return (
      <PaperFade className={classes.paper}>
        <Form className={classes.form} onSubmit={value => onSubmit(value, this.state.isError)}>
          <Grid container spacing={4}>
            <Grid item xs={12} lg={6}>
              <TextField
                fullWidth
                type="text"
                label={I18n.t("Input.user.lastName")}
                name="lastName"
                validate={this.validate.name}
              />
            </Grid>

            <Grid item xs={12} lg={6}>
              <TextField
                fullWidth
                type="text"
                label={I18n.t("Input.user.firstName")}
                name="firstName"
                validate={this.validate.name}
              />
            </Grid>

            <Grid item xs={12} lg={6}>
              <TextField
                fullWidth
                type="text"
                label={I18n.t("Input.email")}
                name="email"
                validate={this.validate.email}
              />
            </Grid>

            <Grid item xs={12} lg={6}>
              <TextField
                fullWidth
                type="text"
                label={I18n.t("Input.phone")}
                name="phone"
                validate={this.validate.phone}
                formatData={this.phoneFormatter}
              />
            </Grid>

            <Grid item xs={12} lg={6}>
              <TextField
                fullWidth
                type="text"
                label={I18n.t("Label.driver.fuelNumber")}
                name="driverCards.fuelNumber"
                validate={this.validate.cardNum}
              />
            </Grid>

            <Grid item xs={12} lg={6}>
              <TextField
                fullWidth
                type="text"
                label={I18n.t("Label.driver.deliverNumber")}
                name="driverCards.deliverNumber"
                validate={this.validate.cardNum}
              />
            </Grid>

            <Grid item xs={12} lg={6}>
              <TextField
                fullWidth
                type="password"
                label={I18n.t("Input.auth.password")}
                name="password"
                validate={this.validate.password}
                onChange={value => this.onChange(value, "password")}
              />
            </Grid>

            <Grid item xs={12} lg={6}>
              <TextField
                fullWidth
                type="password"
                label={I18n.t("Input.auth.rePassword")}
                name="confirmPassword"
                validate={this.validate.rePassword}
                onChange={value => this.onChange(value, "rePassword")}
                error={this.state.isError}
                helperText={this.state.isError ? I18n.t("Validate.passwordNotMatch") : null}
              />

              <TextField
                fullWidth={false}
                type="hidden"
                label={null}
                name="role"
                defaultValue="driver"
                value="driver"
              />
            </Grid>
          </Grid>

          <Grid item xs={12} container direction="row" justify="flex-end" alignItems="flex-end" spacing={2}>
            <Grid item>
              <Button size='small' variant="contained" color="primary" onClick={() => this.goto('/drivers')}>
                <Icon className={classes.sizeIcon}>arrow_back_ios</Icon>{I18n.t("Button.back")}
              </Button>
              <Button size='small' type="submit" variant="contained" color="primary" className={classes.button}>
                {I18n.t("Button.create")}
              </Button>
            </Grid>
          </Grid>
        </Form>
      </PaperFade>
    )
  }
}

Create.propTypes = {
  classes: PropTypes.object.isRequired,
};

export default withStyles(styles)(withRouter(Create));
