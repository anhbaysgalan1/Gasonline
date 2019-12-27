import React from 'react'
import PropTypes from 'prop-types';
import withStyles from '@material-ui/core/styles/withStyles';
import PaperFade from "components/Main/PaperFade";
import {Button, Grid, Icon} from '@material-ui/core';
import {Form, SelectField, TextField, Validation} from 'components/Forms';
import {BaseView} from 'views/BaseView';
import FuelsForm from './components/FuelsForm';
import {renderDriverSelectField} from './Create';
import {I18n} from 'helpers/I18n';
import { withRouter } from 'react-router-dom';

const styles = theme => ({
  editBtn: {
    position: "absolute",
    right: 16,
  },
  editBtnWrap: {
    position: "relative",
  },
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
    this.validate = {
      general: [
        Validation.required(I18n.t("Validate.required.base")),
      ]
    }
  }

  cancel = () => {
    this.goto('/vehicles')
  }

  render() {
    const {classes, onSubmit} = this.props;
    let vehicle = this.getData(this.props, 'vehicle', {})
    let drivers = this.getData(this.props, 'drivers', [])

    return (
      <PaperFade className={classes.paper}>
        <Form className={classes.form} onSubmit={onSubmit}>
          <Grid container spacing={4}>
            <Grid item xs={12} lg={4}>
              <TextField
                fullWidth
                label={I18n.t("Input.vehicle.name")}
                name="name"
                value={vehicle.name}
                validate={this.validate.general}
              />
            </Grid>

            <Grid item xs={12} lg={4}>
              <TextField
                fullWidth
                label={I18n.t("Input.vehicle.licensePlate")}
                name="licensePlate"
                value={vehicle.licensePlate}
                validate={this.validate.general}
              />
            </Grid>

            <Grid item xs={12} lg={4}>
              <SelectField
                fullWidth
                label={I18n.t("Input.vehicle.driver")}
                name="driver"
                value={this.getData(vehicle, 'driver._id', '')}
                validate={this.validate.general}
              >
                {renderDriverSelectField(drivers)}
              </SelectField>
            </Grid>

            <FuelsForm
              type="capacity"
              title={I18n.t("Input.vehicle.capacity")}
              vehicle={vehicle}
            />

            <FuelsForm
              type="remain"
              title={I18n.t("Input.vehicle.remaining")}
              readOnly={true}
              vehicle={vehicle}
            />
          </Grid>
          <Grid item xs={12} container direction="row" justify="flex-end" alignItems="flex-end" spacing={2}>
            <Grid item>
              <Button size='small' variant="contained" color="primary" onClick={() => this.goto('/vehicles')} >
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

export default withStyles(styles)(withRouter(Edit))
