import React from 'react';
import PropTypes from 'prop-types';
import withStyles from '@material-ui/core/styles/withStyles';
import FormControlLabel from '@material-ui/core/FormControlLabel';
import FormControl from '@material-ui/core/FormControl';
import FormLabel from '@material-ui/core/FormLabel';
import RadioUI from '@material-ui/core/Radio';
import RadioGroup from '@material-ui/core/RadioGroup';
import BaseField from './BaseField';
import {connectField} from './Connect';

const debug = require("debug")("mq:form:RadioGroupField")

const styles = theme => ({})

class RadioGroupField extends BaseField {
  constructor(props) {
    super(props)
    this.state = {
      ...this.state,
      [this.valueField]: props[this.valueField]
    }
  }

  render() {
    debug("render RadioGroupField: ", this.props.name);

    const {onChange, onBlur, name, label, children, classes, fullWidth, formatData, ...otherProps} = this.props;

    return (
      <FormControl className={classes.formControl} fullWidth={fullWidth}>
        <FormLabel>{label}</FormLabel>
        <RadioGroup
          ref={ref => this.ref = ref}
          aria-label={name}
          name={name}
          className={classes.group}
          {...otherProps}
          value={this.state.value}
          onChange={e => this.onChange(e.target.value)}
          onBlur={e => this.onBlur(e)}
        >
          {children}
        </RadioGroup>
      </FormControl>
    )
  }
}

RadioGroupField.propTypes = {
  label: PropTypes.string.isRequired,
  name: PropTypes.string.isRequired,
  validate: PropTypes.arrayOf(PropTypes.func),
  onChange: PropTypes.func,
  onBlur: PropTypes.func,
  className: PropTypes.string,
  margin: PropTypes.string,
};

export default withStyles(styles)(connectField(RadioGroupField))

class Radio extends React.Component {
  render() {
    const {label, ...otherProps} = this.props
    return (
      <FormControlLabel
        {...otherProps}
        control={
          <RadioUI
            ref={ref => this.ref = ref}
          />
        }
        label={label}
      />
    )
  }
}

export {
  Radio
}
