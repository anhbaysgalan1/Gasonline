import React from 'react'
import PropTypes from 'prop-types';
import withStyles from '@material-ui/core/styles/withStyles';
import {BaseView} from 'views/BaseView';
import PaperFade from "components/Main/PaperFade";
import {Grid, Typography} from '@material-ui/core';
import {I18n} from 'helpers/I18n';
import {fuelProducts} from 'config/constant';

import CheckboxFuel from './FuelField';

const styles = theme => ({
  wrapper: {
    padding: `0px 16px !important`,
  },
  title: {
    paddingBottom: theme.spacing(2),
  }
});

class FuelsForm extends BaseView {
  constructor(props) {
    super(props);
  }

  renderFuel = (typeNum, order, readOnly) => {
    const {classes} = this.props;
    let arrayFuel = [];

    fuelProducts.forEach((nameFuel, index) => {
      let valueObj = {
        value: this.getData(order, `orderDetails[${index}][${typeNum}]`, null)
      }

      // let fuel = this.getData(order, 'orderDetails', [])
      //   .find(fuel => String(fuel.name) === String(nameFuel))

      arrayFuel.push(
        <Grid item xs={12} lg={12} className={classes.wrapper} key={nameFuel}>
          <CheckboxFuel
            nameFuel={nameFuel}
            label={I18n.t(`Label.products.${nameFuel}`)}
            name={`orderDetails[${index}].${typeNum}`}
            _name={`orderDetails[${index}].name`} // cho trường nameFuel bị ẩn để Submit
            value={{...valueObj}}
            readOnly={readOnly}
          />
        </Grid>
      )
    })
    return arrayFuel
  }

  render() {
    const {classes, title, order, typeNum, readOnly} = this.props;
    // const { fuels } = this.state;
    return (
      <PaperFade className={classes.paper}>
        <Typography variant="h6" className={classes.title}>{title}</Typography>
        <Grid container spacing={4}>
          {this.renderFuel(typeNum, order, readOnly)}
        </Grid>
      </PaperFade>
    )
  }
}

FuelsForm.propTypes = {
  classes: PropTypes.object.isRequired,
  title: PropTypes.string.isRequired
};

export default withStyles(styles)(FuelsForm);
