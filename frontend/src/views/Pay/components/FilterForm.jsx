import React from "react";
import PropTypes from "prop-types";
import withStyles from "@material-ui/core/styles/withStyles";
import {Form, Validation} from "components/Forms";
import AutoCompleteField, {Option as OptionAuto} from "components/Forms/AutoCompleteField";
import {BaseView} from "views/BaseView";
import {I18n} from "helpers/I18n";
import {Button, Grid} from "@material-ui/core";
import _ from "lodash";
import {customerPaymentTerms, months, object} from "config/constant";

const styles = theme => ({
  buttonConfirm: {
    marginTop: "15px",
    textAlign: 'right'
  },
  form: {
    [theme.breakpoints.down("sm")]: {
      padding: `${theme.spacing.unit * 0.5}px ${theme.spacing.unit * 2}px`
    },
    [theme.breakpoints.up("md")]: {
      padding: `${theme.spacing.unit * 0.5}px ${theme.spacing.unit * 2}px`
    }
  }
});

class Create extends BaseView {
  constructor(props) {
    super(props);
    this.state = {
      data: {}
    };
    this.validate = {
      code: [Validation.required(I18n.t("Validate.required.base"))],
      name: [Validation.required(I18n.t("Validate.required.base"))]
    };

    this.filter = {
      type: 1
    };
  }

  onHandleChange = (name, {value}) => {
    this.filter[name] = value;
    if (this.filter["type"] && this.filter["paymentTerm"]) {
      this.filter["type"] = Number(this.filter["type"]); //fix bugs
      this.props.loadUser(this.filter);
    }
    this.setState({
      data: {...this.state.data, [name]: value}
    });
  };

  render() {
    let {data} = this.state;
    let paymentTerm = _.get(data, "paymentTerm", "");
    let month = _.get(data, "month", "");
    let type = _.get(data, "type", "1");
    const {classes, onSubmit, customers = []} = this.props;
    return (
      <Form className={classes.form} onSubmit={onSubmit}>
        <Grid container spacing={2} direction="row" justify="flex-start">
          <Grid item xs={3}>
            <AutoCompleteField
              key="0"
              margin="dense"
              select
              label={I18n.t("Input.customer.type")}
              name="type"
              isMulti={false}
              defaultValue="1"
              isClearable={false}
              onChange={value => this.onHandleChange("type", value)}
            >
              {object.map(item => (
                <OptionAuto
                  key={item.value}
                  value={item.value}
                  showCheckbox={false}
                >
                  {item.name}
                </OptionAuto>
              ))}
            </AutoCompleteField>
          </Grid>
          <Grid item xs={9}></Grid>
          <Grid item xs={3}>
            <AutoCompleteField
              key="1"
              fullWidth
              margin="dense"
              select
              label={I18n.t("Label.month")}
              name="month"
              isMulti={false}
              isClearable={false}
              onChange={value => this.onHandleChange("month", value)}
            >
              {months.map(item => (
                <OptionAuto
                  key={item.value}
                  value={item.value}
                  showCheckbox={false}
                >
                  {item.text}
                </OptionAuto>
              ))}
            </AutoCompleteField>
          </Grid>
          <Grid item xs={3}>
            <AutoCompleteField
              key="2"
              fullWidth
              margin="dense"
              select
              label={I18n.t("Input.customer.paymentTerm")}
              name="paymentTerm"
              isMulti={false}
              isDisabled={month ? false : true}
              isClearable={false}
              onChange={value => this.onHandleChange("paymentTerm", value)}
            >
              {customerPaymentTerms.map(item => (
                <OptionAuto
                  key={item.value}
                  value={item.value}
                  showCheckbox={false}
                >
                  {item.text}
                </OptionAuto>
              ))}
            </AutoCompleteField>
          </Grid>
          <Grid item xs={3}>
            <AutoCompleteField
              key="2"
              fullWidth
              select
              margin="dense"
              label={I18n.t("Input.customer.code")}
              name="customer"
              isMulti={false}
              isClearable={false}
              isDisabled={month && paymentTerm ? false : true}
            >
              <OptionAuto key="-1" value="" showCheckbox={false}>
                {I18n.t("Label.all")}
              </OptionAuto>
              {customers.map(item => (
                <OptionAuto
                  key={item._id}
                  value={item._id}
                  showCheckbox={false}
                >
                  {item.name} - {item.code}
                </OptionAuto>
              ))}
            </AutoCompleteField>
          </Grid>
          <Grid item xs={3} className={classes.buttonConfirm}>
            <Button
              type="submit"
              variant="contained"
              color="primary"
              disabled={month && paymentTerm ? false : true}
              onClick={() => this.props.getTypeViews(type)}
            >
              {I18n.t("Button.confirm")}
            </Button>
          </Grid>
        </Grid>
      </Form>
    );
  }
}

Create.propTypes = {
  classes: PropTypes.object.isRequired
};

export default withStyles(styles)(Create);
