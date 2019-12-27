import React from 'react';
import PropTypes from 'prop-types';
import withStyles from '@material-ui/core/styles/withStyles';
import BaseField from './BaseField';
import {connectField} from './Connect'
import Slider from 'rc-slider';
import 'rc-slider/assets/index.css';

const createSliderWithTooltip = Slider.createSliderWithTooltip;
const Range = createSliderWithTooltip(Slider.Range);

const debug = require("debug")("mq:form:TextField")
const styles = theme => ({
  textField: {},
})

class SliderField extends BaseField {
  constructor(props) {
    super(props)
    this.state = {
      ...this.state,
    }
  }

  render() {
    //console.log("render: ", this.props.name)
    debug("render TextField: ", this.props.name)
    debug("props: ", this.props)

    const {margin, defaultValue, classes, className, name, ...otherProps} = this.propsRemovedIgrone()
    return (
      <Range
        {...otherProps}
        name={name}
        error={this.state.error ? true : false}
        helperText={this.state.error}
        className={`${classes.TextField} ${className}`}
        inputRef={ref => this.ref = ref}
        margin={margin || "normal"}
        value={this.state.value}
        onChange={value => this.onChange(value)}
        onBlur={e => this.onBlur(e)}
      />
    )
  }
}

SliderField.propTypes = {
  label: PropTypes.string,
  name: PropTypes.string.isRequired,
  validate: PropTypes.arrayOf(PropTypes.func),
  onChange: PropTypes.func,
  onBlur: PropTypes.func,
  className: PropTypes.string,
  margin: PropTypes.string
};

export default withStyles(styles)(connectField(SliderField))
