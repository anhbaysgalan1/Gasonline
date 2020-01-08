import React from 'react'
import PropTypes from 'prop-types';
import {Button, Grid, InputAdornment, Icon} from '@material-ui/core';
import withStyles from '@material-ui/core/styles/withStyles';
import {FontAwesomeIcon} from '@fortawesome/react-fontawesome';
import {faPlus, faYenSign} from '@fortawesome/free-solid-svg-icons';
import {Form, TextField, Validation, MoneyField} from 'components/Forms';
import PaperFade from "components/Main/PaperFade";
import {BaseView} from 'views/BaseView';
import {renderCustomerFlagRadio, renderCustomerTypeRadio, renderPaymentTermSelectField} from './components';
import {minDate} from '../../config/constant';
import {I18n} from 'helpers/I18n';
import { withRouter } from 'react-router-dom';

const styles = theme => ({
  inputAdornment: {
    // width: "30%",
    fontSize: "small"
  },
  withoutLabel: {
    marginTop: theme.spacing(4),
  },
  icon: {
    color: theme.palette.grey.dark,
  },
  iconPlus: {
    color: theme.palette.grey.dark,
    marginLeft: theme.spacing(1),
  },
  radioGroup: {
    alignSelf: "flex-end",
  },
  button: {
    marginLeft: '5px'
  },
  sizeIcon: {
    fontSize: '15px'
  }
});

class Create extends BaseView {
  constructor(props) {
    super(props);
    this.state = {
      showCustomerFlag: false
    };
    this.validate = {
      phone: [
        Validation.required(I18n.t("Validate.required.base")),
        Validation.maxLength(13, I18n.t("Validate.phone.maxLength")),
      ],
      date: [
        Validation.required(I18n.t("Validate.required.base")),
        Validation.checkDateTime(minDate, I18n.t("Validate.dateInvalid"), I18n.t("Validate.minDate"))
      ],
      code: [
        Validation.required(I18n.t("Validate.required.base")),
        Validation.maxLength(255, I18n.t("Validate.maxLength")),
      ],
      name: [
        Validation.required(I18n.t("Validate.required.base")),
        Validation.maxLength(255, I18n.t("Validate.maxLength")),
      ],
      address: [
        Validation.required(I18n.t("Validate.required.base")),
        Validation.maxLength(255, I18n.t("Validate.maxLength")),
      ]
    };
  }

  onChangeCustomerType = (value) => {
    if (value === '2') {
      this.setState({showCustomerFlag: true})
    } else {
      this.setState({showCustomerFlag: false})
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
  cancel = () => {
    this.goto('/customers')
  }

  render() {
    const {classes, onSubmit} = this.props;
    let {showCustomerFlag} = this.state

    return (
      <PaperFade>
        <Form onSubmit={onSubmit}>
          <Grid container spacing={4}>
            <Grid item xs={12} sm={12} md={3} lg={3}>
              <TextField
                fullWidth
                label={I18n.t("Input.customer.code")}
                name="code"
                validate={this.validate.code}
                onKeyDown={(e) => {
                  if ([" ",].indexOf(e.key) >= 0) {
                     e.preventDefault()
                  }
                }}
              />
            </Grid>
            <Grid item xs={12} sm={12} md={6} lg={6}>
              <TextField
                fullWidth
                label={I18n.t("Input.customer.name")}
                name="name"
                validate={this.validate.name}
              />
            </Grid>
            <Grid item xs={12} sm={12} md={3} lg={3}>
              {renderPaymentTermSelectField()}
            </Grid>

            <Grid item xs={12} sm={12} md={4} lg={3}>
              <TextField
                fullWidth
                label={I18n.t("Input.phone")}
                name="phone"
                validate={this.validate.phone}
                formatData={this.phoneFormatter}
              />
            </Grid>
            <Grid item xs={12} sm={12} md={8} lg={6}>
              <TextField
                fullWidth
                label={I18n.t("Input.address")}
                name="address"
                validate={this.validate.address}
              />
            </Grid>
            <Grid item xs={12} lg={3}>
              <MoneyField
                fullWidth
                name="extraPrice"
                disabled={showCustomerFlag}
                validate={[Validation.required(I18n.t("Validate.required.base"))]}
                className={classes.withoutLabel}
                InputProps={{
                  startAdornment:
                    <InputAdornment position="start" className={classes.inputAdornment}>
                      {I18n.t("Input.customer.extendPrice")}
                      <FontAwesomeIcon icon={faPlus} className={classes.iconPlus}/>
                    </InputAdornment>,
                  endAdornment:
                    <InputAdornment position="end">
                      <FontAwesomeIcon icon={faYenSign} className={classes.icon}/>
                    </InputAdornment>
                }}
              />
            </Grid>

            <Grid item xs={12} lg={6} className={classes.radioGroup}>
              {renderCustomerTypeRadio(1, false, this.onChangeCustomerType)}
            </Grid>
            <Grid item xs={12} lg={6} className={classes.radioGroup}>
              {showCustomerFlag ? renderCustomerFlagRadio() : '' }
            </Grid>
          </Grid>
          <Grid item xs={12} container direction="row" justify="flex-end" alignItems="flex-end" spacing={2}>
            <Grid item>
              <Button size='small' type="submit" variant="contained" color="primary" onClick={() =>  this.goto('/customers')} className={classes.button} >
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
