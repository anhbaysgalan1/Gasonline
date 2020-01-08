import React from 'react'
import PropTypes from 'prop-types';
import withStyles from '@material-ui/core/styles/withStyles';
import {BaseView} from 'views/BaseView';
import PaperFade from "components/Main/PaperFade";
import {Form, TextField, Validation} from 'components/Forms'
import SelectField, {Option} from 'components/Forms/SelectField';
import {Button, Grid, Typography, Icon} from '@material-ui/core';
import {I18n} from 'helpers/I18n';
import { withRouter } from 'react-router-dom';

const styles = theme => ({
  button: {
    marginLeft: '5px'
  },
  sizeIcon: {
    fontSize: '15px'
  }
});
 
export const renderDriverSelectField = (drivers = []) => {
  let result = []
  for (let driver of drivers) {
    result.push(<Option key={driver._id} value={driver._id}>{driver.fullName}</Option>)
  }
  return result
}

class Create extends BaseView {
  constructor(props) {
    super(props)
    this.state = {}
    this.validate = {
      name: [
        Validation.required(I18n.t("Validate.required.base")),
        Validation.maxLength(255, I18n.t("Validate.maxLength")),
      ],
      fuel: [
        Validation.required(I18n.t("Validate.required.base")),
      ]
    }
  }

  renderFuelField(type, name, noRequired) {
    return (
      <Grid item xs={12} lg={4}>
        <TextField
          fullWidth
          type="text"
          label={I18n.t(`Label.products.${name}`)}
          name={`${type}.${name}`}
          validate={!noRequired ? this.validate.fuel : []}
        />
      </Grid>
    )
  }

  render() {
    const {classes, onSubmit} = this.props
    let drivers = this.getData(this.props, 'drivers', [])
    return (
      <PaperFade className={classes.paper}>
        <Form className={classes.form} onSubmit={value => onSubmit(value)}>
          <Grid container spacing={4}>
            <Grid item xs={12} lg={4}>
              <TextField
                fullWidth
                label={I18n.t("Table.vehicle.name")}
                name="name"
                validate={this.validate.name}
              />
            </Grid>
            <Grid item xs={12} lg={4}>
              <TextField
                fullWidth
                label={I18n.t("Table.vehicle.licensePlate")}
                name="licensePlate"
                validate={this.validate.name}
              />
            </Grid>
            <Grid item xs={12} lg={4}>
              <SelectField
                fullWidth
                label={I18n.t("Input.vehicle.driver")}
                name="driver"
                validate={this.validate.name}
              >
                {renderDriverSelectField(drivers)}
              </SelectField>
            </Grid>

            <Grid item xs={12} lg={12}>
              <Typography variant="h6">{I18n.t("Input.vehicle.capacity")}</Typography>
            </Grid>

            {this.renderFuelField("capacity", "kerosene")}
            {this.renderFuelField("capacity", "diesel")}
            {this.renderFuelField("capacity", "gasoline")}

            <Grid item xs={12} lg={12}>
              <Typography variant="h6">{I18n.t("Input.vehicle.remaining")}</Typography>
            </Grid>

            {this.renderFuelField("remain", "kerosene", 1)}
            {this.renderFuelField("remain", "diesel", 1)}
            {this.renderFuelField("remain", "gasoline", 1)}

          </Grid>
          <Grid item xs={12} container direction="row" justify="flex-end" alignItems="flex-end" spacing={2}>
            <Grid item>
              <Button size='small' variant="contained" color="primary" onClick={() => this.goto('/vehicles')} >
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
