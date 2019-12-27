import React from 'react'
import PropTypes from 'prop-types';
import withStyles from '@material-ui/core/styles/withStyles';
import {Button, Grid, Icon} from '@material-ui/core';
import {BaseView} from 'views/BaseView';
import {Form, SelectField, TextField} from 'components/Forms';
import PaperFade from "components/Main/PaperFade";
import FuelsForm from './components/FuelsForm';
import {renderDriverSelectField} from './Create';
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

class Detail extends BaseView {
  constructor(props) {
    super(props)
  }

  cancel = () => {
    this.goto('/vehicles')
  }

  render() {
    const {classes} = this.props;
    let vehicle = this.getData(this.props, 'vehicle', {});
    let drivers = this.getData(this.props, 'drivers', []);

    return (
      <PaperFade className={classes.paper}>
        <Form className={classes.form}>
          <Grid container spacing={4}>
            <Grid item xs={12} lg={4}>
              <TextField
                fullWidth
                label={I18n.t("Input.vehicle.name")}
                name="name"
                value={vehicle.name}
                InputProps={{
                  readOnly: true,
                  disabled: true
                }}
              />
            </Grid>

            <Grid item xs={12} lg={4}>
              <TextField
                fullWidth
                label={I18n.t("Input.vehicle.licensePlate")}
                name="licensePlate"
                value={vehicle.licensePlate}
                InputProps={{
                  readOnly: true,
                  disabled: true
                }}
              />
            </Grid>

            <Grid item xs={12} lg={4}>
              <SelectField
                fullWidth
                label={I18n.t("Input.vehicle.driver")}
                name="driver"
                value={this.getData(vehicle, 'driver._id', '')}
                InputProps={{
                  readOnly: true,
                  disabled: true
                }}
              >
                {renderDriverSelectField(drivers)}
              </SelectField>
            </Grid>

            <FuelsForm
              type="capacity"
              title={I18n.t("Input.vehicle.capacity")}
              vehicle={vehicle}
              readOnly={true}
            />

            <FuelsForm
              type="remain"
              title={I18n.t("Input.vehicle.remaining")}
              vehicle={vehicle}
              readOnly={true}
            />
          </Grid>
          <Grid item xs={12} container direction="row" justify="flex-end" alignItems="flex-end" spacing={2}>
            <Grid item>
              <Button size='small' variant="contained" color="primary" onClick={() => this.goto('/vehicles')} >
                <Icon className={classes.sizeIcon}>arrow_back_ios</Icon>{I18n.t("Button.back")}
              </Button>
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

export default withStyles(styles)(withRouter(Detail));
