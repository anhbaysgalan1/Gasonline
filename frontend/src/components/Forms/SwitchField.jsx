import React from 'react';
import PropTypes from 'prop-types';
import withStyles from '@material-ui/core/styles/withStyles';
import FormControlLabel from '@material-ui/core/FormControlLabel'
import Switch from '@material-ui/core/Switch';
import BaseField from './BaseField';
import {connectField} from './Connect'

const debug = require("debug")("mq:form:SelectField")
const styles = theme => ({})

class SwitchField extends BaseField {
  constructor(props) {
    super(props)
    this.valueField = "checked"
    this.state = {
      ...this.state,
      [this.valueField]: props[this.valueField] === true ? true : false
    }
  }

  render() {
    debug("render SwitchField: ", this.props.name)
    const {onChange, onBlur, name, label, ...otherProps} = this.props

    return (
      <FormControlLabel
        control={
          <Switch
            {...otherProps}
            name={name}
            checked={this.state.checked}
            ref={ref => this.ref = ref}
            onChange={e => this.onChange(e.target.checked)}
            onBlur={e => this.onBlur(e)}
          />
        }
        label={label}
      />
    )
  }
}

SwitchField.propTypes = {
  label: PropTypes.string.isRequired,
  name: PropTypes.string.isRequired,
  validate: PropTypes.arrayOf(PropTypes.func),
  onChange: PropTypes.func,
  onBlur: PropTypes.func,
  className: PropTypes.string,
  margin: PropTypes.string,
  showTime: PropTypes.bool,
  showDate: PropTypes.bool,
};

export default withStyles(styles)(connectField(SwitchField))
