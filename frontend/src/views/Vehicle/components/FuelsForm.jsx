import React from 'react'
import PropTypes from 'prop-types';
import withStyles from '@material-ui/core/styles/withStyles';
import {Grid, Typography} from '@material-ui/core';
import {TextField, Validation} from 'components/Forms';
import {BaseView} from 'views/BaseView';
import {I18n} from 'helpers/I18n';

const styles = theme => ({});

class FuelsForm extends BaseView {
  constructor(props) {
    super(props)
    this.validate = {
      fuel: [
        Validation.required(I18n.t("Validate.required.base")),
      ],
    }
  }

  renderForm(vehicle, type) {
    const { readOnly, noRequired } = this.props
    let fuels = this.getData(vehicle, type, [])
    return (
      <React.Fragment>
        {fuels ?
          <React.Fragment>
            {Object.keys(fuels).map((fuel, index) =>
              <Grid item xs={12} lg={4} key={fuel.id}>
                <TextField
                  fullWidth
                  type="text"
                  label={I18n.t(`Label.products.${fuel}`)}
                  name={`${type}.${fuel}`} //remaining or capacity
                  value={fuels[fuel]}
                  validate={ !noRequired ? this.validate.fuel : []}
                  InputProps={{
                    disabled: readOnly,
                    readOnly: readOnly
                  }}
                />
              </Grid>
            )}
          </React.Fragment>
          : ""
        }
      </React.Fragment>
    )
  }

  render() {
    const {vehicle, title, type} = this.props;
    return (
      <React.Fragment>
        <Grid item xs={12} lg={12}>
          <Typography variant="h6">{title}</Typography>
        </Grid>
        {this.renderForm(vehicle, type)}
      </React.Fragment>
    )
  }
}

FuelsForm.propTypes = {
  classes: PropTypes.object.isRequired,
};

export default withStyles(styles)(FuelsForm);
