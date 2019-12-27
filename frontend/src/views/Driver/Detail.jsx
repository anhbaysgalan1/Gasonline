import React from 'react'
import PropTypes from 'prop-types';
import withStyles from '@material-ui/core/styles/withStyles';
import {TextField} from 'components/Forms';
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

class Detail extends BaseView {
  constructor(props) {
    super(props)
    this.state = {}
  }

  cancel = () => {
    this.goto('/drivers')
  }

  render() {
    const {classes} = this.props
    let driver = this.getData(this.props, 'driver', {});
    return (
      <PaperFade className={classes.paper}>
        <Grid container spacing={4}>
          <Grid item xs={12} lg={6}>
            <TextField
              fullWidth
              type="text"
              label={I18n.t("Input.user.lastName")}
              name="lastName"
              value={driver.lastName}
              disabled={true}
            />
          </Grid>

          <Grid item xs={12} lg={6}>
            <TextField
              fullWidth
              type="text"
              label={I18n.t("Input.user.firstName")}
              name="firstName"
              value={driver.firstName}
              disabled={true}
            />
          </Grid>

          <Grid item xs={12} lg={6}>
            <TextField
              fullWidth
              type="email"
              label={I18n.t("Input.email")}
              name="email"
              value={driver.email}
              disabled={true}
            />
          </Grid>

          <Grid item xs={12} lg={6}>
            <TextField
              fullWidth
              type="text"
              label={I18n.t("Input.phone")}
              name="phone"
              value={driver.phone}
              disabled={true}
            />
          </Grid>

          <Grid item xs={12} lg={6}>
            <TextField
              fullWidth
              type="text"
              label={I18n.t("Label.driver.fuelNumber")}
              name="driverCards.fuelNumber"
              value={this.getData(driver, 'driverCards.fuelNumber', '')}
              disabled={true}
            />
          </Grid>

          <Grid item xs={12} lg={6}>
            <TextField
              fullWidth
              type="text"
              label={I18n.t("Label.driver.deliverNumber")}
              name="driverCards.deliverNumber"
              value={this.getData(driver, 'driverCards.deliverNumber', '')}
              disabled={true}
            />
          </Grid>
        </Grid>
        <Grid item xs={12} container direction="row" justify="flex-end" alignItems="flex-end" spacing={2}>
            <Grid item>
              <Button size='small' variant="contained" color="primary" onClick={() => this.goto('/drivers')} >
                <Icon className={classes.sizeIcon}>arrow_back_ios</Icon>{I18n.t("Button.back")}
              </Button>
            </Grid>
          </Grid>
      </PaperFade>
    )
  }
}

Detail.propTypes = {
  classes: PropTypes.object.isRequired,
};

export default withStyles(styles)(withRouter(Detail));
