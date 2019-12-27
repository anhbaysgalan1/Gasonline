import React from 'react'
import PropTypes from 'prop-types';
import withStyles from '@material-ui/core/styles/withStyles';
import {TextField, Validation, CheckboxField} from 'components/Forms'
import {BaseView} from 'views/BaseView';
import {I18n} from 'helpers/I18n';
import {Grid} from '@material-ui/core';
import InputAdornment from '@material-ui/core/InputAdornment';

const styles = theme => ({
  checkbox: {
    alignSelf: "flex-end",
  },
});

class FuelField extends BaseView {
  constructor(props) {
    super(props);
    this.state = {
      checked: false,
      value: null,
      disabled: false,
    };
    this.onChange = this.onChange.bind(this)
  }

  componentDidUpdate(prevProp) {
    if (prevProp.value !== this.props.value) {
      let value = this.getData(this.props, "value.value", null);
      if (value) {
        this.setState({
          value: value,
          checked: true
        })
      }
      if (!value && this.props.readOnly) {
        this.setState({
          disabled: true
        })
      }
    }
  }

  onChange(checked) {
    this.setState({checked: checked, value: null}) // set value TextField về null
  }

  formatData = (value, readOnly) => {
    return readOnly ? true : value
  }

  render() {
    const {classes, label, name, _name, nameFuel, readOnly} = this.props;
    const {value, checked} = this.state;
    return (
      <Grid container>
        <Grid item xs={12} sm={6} className={classes.checkbox}>
          <CheckboxField
            label={label}
            name="checkbox"
            formatData={value => this.formatData(value, readOnly)}
            checked={checked}
            onChange={checked => this.onChange(checked, readOnly)}
            disabled={this.state.disabled}
          />
        </Grid>

        <Grid item xs={12} sm={6}>
          {(checked) ?
            <TextField
              fullWidth
              name={name}
              formatData={this.formatData}
              type="text"
              value={value}
              placeholder={I18n.t("Placeholder.quantity")}
              validate={[Validation.required(I18n.t("Validate.required.base"))]}
              InputProps={{
                endAdornment:
                  <InputAdornment position="end">L</InputAdornment>,
                readOnly: readOnly ? true : false
              }}
            />
            : ""
          }
        </Grid>

        {/* ẩn trường nameFuel */}
        <TextField
          name={_name}
          value={nameFuel}
          type="hidden"
          InputProps={{
            disableUnderline: true
          }}
        />
      </Grid>
    )
  }
}

FuelField.propTypes = {
  classes: PropTypes.object.isRequired,
  label: PropTypes.string.isRequired,
  name: PropTypes.string.isRequired
};

export default withStyles(styles)(FuelField);
