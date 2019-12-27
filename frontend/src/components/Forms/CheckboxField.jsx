import React from 'react';
import PropTypes from 'prop-types';
import withStyles from '@material-ui/core/styles/withStyles';
import FormControlLabel from '@material-ui/core/FormControlLabel'
import Checkbox from '@material-ui/core/Checkbox';
import BaseField from './BaseField';
import {connectField} from './Connect'

const debug = require("debug")("mq:form:CheckboxField")
const styles = theme => ({})

class CheckboxField extends BaseField {
  constructor(props) {
    super(props)
    this.valueField = "checked"
    this.state = {
      ...this.state,
      [this.valueField]: props[this.valueField] === true ? true : false
    }
  }

  render() {
    debug("render CheckboxField: ", this.props.name)
    const {name, label, formatData, ...otherProps} = this.propsRemovedIgrone()

    return (
      <FormControlLabel
        control={
          <Checkbox
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

CheckboxField.propTypes = {
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

export default withStyles(styles)(connectField(CheckboxField))
