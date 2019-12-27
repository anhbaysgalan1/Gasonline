import React from 'react';
import PropTypes from 'prop-types';
import withStyles from '@material-ui/core/styles/withStyles';
import {Grid} from '@material-ui/core';
import {TextField} from 'components/Forms';
import {BaseView} from 'views/BaseView';
import {fuelProducts} from 'config/constant';
import Utils from 'helpers/utility';
import {I18n} from 'helpers/I18n';

const styles = theme => ({});

class CreateForm extends BaseView {
  constructor(props) {
    super(props)
    this.state = {}
  }

  renderInputFuels() {
    let fuels = ['dieselFreeTax', ...fuelProducts];
    return fuels.map(fuel => Utils.renderFormInputFuel(fuel))
  }

  render() {
    const {typeExport} = this.props
    return (
      <Grid container spacing={1}>
        {this.renderInputFuels()}

        {typeExport === "separate" ?
          <Grid item xs={12} lg={6}>
            <TextField
              fullWidth
              type="text"
              variant='outlined'
              margin='none'
              label={I18n.t(`Label.receivedVehicle`)}
              name="receivedVehicle"
              formatData={this.formatData}
            />
          </Grid>
          : ''
        }
      </Grid>
    )
  }
}

CreateForm.propTypes = {
  classes: PropTypes.object.isRequired,
};

export default withStyles(styles)(CreateForm);
