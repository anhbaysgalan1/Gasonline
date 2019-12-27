import React from 'react'
import PropTypes from 'prop-types';
import {Button, Grid, InputAdornment, Icon} from '@material-ui/core';
import withStyles from '@material-ui/core/styles/withStyles';
import {FontAwesomeIcon} from '@fortawesome/react-fontawesome';
import {faPlus, faYenSign} from '@fortawesome/free-solid-svg-icons';
import {Form, TextField} from 'components/Forms';
import PaperFade from "components/Main/PaperFade";
import {BaseView} from 'views/BaseView';
import {renderCustomerFlagRadio, renderCustomerTypeRadio, renderPaymentTermSelectField} from './components';
import {I18n} from 'helpers/I18n';

const styles = theme => ({
  inputAdornment: {
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

class Detail extends BaseView {
  constructor(props) {
    super(props);
    this.state = {
      showCustomerFlag: false
    }
  }

  componentDidMount() {
    let customer = this.getData(this.props, 'customer', {})
    if (customer.type === 2) {
      this.setState({showCustomerFlag: true})
    } else {
      this.setState({showCustomerFlag: false})
    }
  }

  componentDidUpdate(prevProps) {
    let customer = this.getData(this.props, 'customer', {})
    let prevCustomer = this.getData(prevProps, 'customer', {})
    if (customer.type !== prevCustomer.type) {
      if (customer.type === 2) {
        this.setState({showCustomerFlag: true})
      } else {
        this.setState({showCustomerFlag: false})
      }
    }
  }

  render() {
    const {classes} = this.props;
    let customer = this.getData(this.props, 'customer', {});
    let {showCustomerFlag} = this.state

    return (
      <PaperFade>
        <Form>
          <Grid container spacing={4}>
            <Grid item xs={12} sm={12} md={3} lg={3}>
              <TextField
                fullWidth
                disabled={true}
                label={I18n.t("Input.customer.code")}
                value={customer.code || ''}
                name="code"
                InputProps={{
                  readOnly: true,
                }}
              />
            </Grid>

            <Grid item xs={12} sm={12} md={6} lg={6}>
              <TextField
                fullWidth
                disabled={true}
                label={I18n.t("Input.customer.name")}
                name="name"
                value={customer.name || ''}
                InputProps={{
                  readOnly: true,
                }}
              />
            </Grid>

            <Grid item xs={12} sm={12} md={3} lg={3}>
              {renderPaymentTermSelectField(customer.paymentTerm, true)}
            </Grid>

            <Grid item xs={12} sm={12} md={3} lg={3}>
              <TextField
                fullWidth
                disabled={true}
                label={I18n.t("Input.phone")}
                name="phone"
                value={customer.phone || ''}
                formatData={this.formatData}
                InputProps={{
                  readOnly: true,
                }}
              />
            </Grid>

            <Grid item xs={12} lg={6}>
              <TextField
                fullWidth
                disabled={true}
                label={I18n.t("Input.address")}
                name="address"
                value={customer.address || ''}
                InputProps={{
                  readOnly: true,
                }}
              />
            </Grid>

            <Grid item xs={12} lg={3}>
              <TextField
                fullWidth
                disabled={true}
                name="extraPrice"
                value={customer.extraPrice || ''}
                formatData={this.formatData}
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
                    </InputAdornment>,
                  readOnly: true,
                }}
              />
            </Grid>

            <Grid item xs={12} lg={6} className={classes.radioGroup}>
              {renderCustomerTypeRadio(this.getData(customer, "type", 1), true)}
            </Grid>

            {showCustomerFlag ?
              <Grid item xs={12} lg={6} className={classes.radioGroup}>
                {renderCustomerFlagRadio(this.getData(customer, "flag", 'A'), true)}
              </Grid>
              : ''
            }
            <Grid item xs={12} container direction="row" justify="flex-end" alignItems="flex-end" spacing={2}>
              <Grid item>
                <Button size='small' type="submit" variant="contained" color="primary" onClick={() =>  this.goto('/customers')} className={classes.button} >
                  <Icon className={classes.sizeIcon}>arrow_back_ios</Icon>{I18n.t("Button.back")}
                </Button>
              </Grid>
            </Grid>
          </Grid>
        </Form>
      </PaperFade>
    )
  }
}

Detail.propTypes = {
  classes: PropTypes.object.isRequired,
};

export default withStyles(styles)(Detail);
