import React from "react";
import PropTypes from "prop-types";
import withStyles from "@material-ui/core/styles/withStyles";
import { Form, Validation, DateTimeField } from "components/Forms";
import AutoCompleteField, {
  Option as OptionAuto
} from "components/Forms/AutoCompleteField";
import { BaseView } from "views/BaseView";
import { I18n } from "helpers/I18n";
import {
  Grid,
  Button
} from "@material-ui/core";
import { object} from "config/constant";
import _ from "lodash";
import moment from "moment";

const styles = theme => ({
  buttonConfirm: {
    marginTop: "15px",
    textAlign: "right"
  },
  form: {
    [theme.breakpoints.down("sm")]: {
      padding: `${theme.spacing.unit * 0.5}px ${theme.spacing.unit * 2}px`
    },
    [theme.breakpoints.up("md")]: {
      padding: `${theme.spacing.unit * 0.5}px ${theme.spacing.unit * 2}px`
    }
  },
  nonePadding: {
    padding: '0 !important'
  }
});

class Create extends BaseView {
  constructor(props) {
    super(props);
    this.state = {
      checkEndTime: false,
      reload: false,
      data: {}
    };
    this.validate = {
      code: [Validation.required(I18n.t("Validate.required.base"))],
      name: [Validation.required(I18n.t("Validate.required.base"))]
    };
  }

  onHandleChange = (name, { value }) => {
    this.setState({ data: { ...this.state.data, [name]: value } });
    this.props.loadUser({[name]: value})
  };

  onHandleDate = (name, value) => {
    this.setState({ data: { ...this.state.data, [name]: value } }, () => {
      this.endDateField.onValidate();
    });
  };

  validateEndDate = value => {
    let startDate = _.get(this.state.data, "startDate", new Date());
    if (moment(value).isBefore(startDate)) {
      return I18n.t("Validate.required.endTime");
    }
  };

  renderOptionCustomer ({customers=[], type}) {
    return (
      customers
        .reduce((res, item) => (
          item.type != type 
            ? res
            : [
              ...res, 
              <OptionAuto
                key={item._id}
                value={item._id}
                showCheckbox={false}
              >
                {item.name} - {item.code}
              </OptionAuto>
            ]
        ), [
          <OptionAuto key="0" value="" showCheckbox={false}>
            {I18n.t("Label.all")}
          </OptionAuto>
        ])
    )
  }

  render() {
    let { classes, onSubmit, customers = [] } = this.props;
    let { data } = this.state;
    let startDate = _.get(data, "startDate", "");
    let endDate = _.get(data, "endDate", "");
    let type = _.get(data, "type", "1");

    return (
      <Form className={classes.form} onSubmit={onSubmit}>
        <Grid container spacing={2}>
          <Grid item xs={12} sm={6} md={3} lg={3}>
            <AutoCompleteField
              key="0"
              fullWidth
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
          <Grid item xs={12} sm={6} md={9} lg={9} className={classes.nonePadding}></Grid>
          <Grid item xs={12} sm={6} md={3} lg={3}>
            <DateTimeField
              fullWidth
              label={I18n.t("Label.dateRange.fromDate")}
              name="startDate"
              format="YYYY/MM/DD"
              margin="dense"
              showTime={false}
              className={classes.DateTime}
              onChange={value => this.onHandleDate("startDate", value)}
            />
          </Grid>
          <Grid item xs={12} sm={6} md={3} lg={3}>
            <DateTimeField
              fullWidth
              label={I18n.t("Label.dateRange.toDate")}
              name="endDate"
              format="YYYY/MM/DD"
              margin="dense"
              showTime={false}
              value={endDate}
              className={classes.DateTime}
              onChange={value => this.onHandleDate("endDate", value)}
              validate={[this.validateEndDate]}
              forwardRef={ref => (this.endDateField = ref)}
            />
          </Grid>
          <Grid item xs={12} sm={6} md={3} lg={3}>
            <AutoCompleteField
              key="2"
              fullWidth
              select
              margin="dense"
              label={I18n.t("Input.customer.code")}
              name="customer"
              isMulti={false}
              isClearable={false}
              isDisabled={startDate && endDate ? false : true}
            >
              {this.renderOptionCustomer({customers, type})}
            </AutoCompleteField>
          </Grid>
          <Grid item xs={12} sm={6} md={3} lg={3} className={classes.buttonConfirm}>
            <Button
              disabled={startDate && endDate ? false : true}
              type="submit"
              variant="contained"
              color="primary"
              onClick={() => this.props.setTypeViews(type)}
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
