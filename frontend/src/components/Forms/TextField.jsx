import React from 'react';
import PropTypes from 'prop-types';
import withStyles from '@material-ui/core/styles/withStyles';
import TextField from '@material-ui/core/TextField';
import BaseField from './BaseField';
import {connectField} from './Connect'

const debug = require("debug")("mq:form:TextField")
const styles = theme => ({
  textField: {},
})

class TextFieldCustom extends BaseField {
  constructor(props) {
    super(props)
    this.state = {
      ...this.state,
    }
  }

  handleHelperText() {
    if (typeof this.props.helperText === "string") {
      return this.props.helperText;
    }
    return this.state.error;
  }

  render() {
    //console.log("render: ", this.props.name)
    debug("render TextField: ", this.props.name)
    debug("props: ", this.props)

    const {margin, defaultValue, classes, className, name, formatData, error, helperText, ...otherProps} = this.propsRemovedIgrone()
    return (
      <TextField
        {...otherProps}
        name={name}
        error={(this.state.error || this.props.error) ? true : false}
        helperText={this.handleHelperText()}
        className={`${classes.TextField} ${className}`}
        inputRef={ref => this.ref = ref}
        margin={margin || "normal"}
        value={this.state.value}
        onChange={e => this.onChange(e.target.value)} // kế thừa từ BaseField
        onBlur={e => this.onBlur(e)}
      />
    )
  }
}

TextFieldCustom.propTypes = {
  label: PropTypes.string,
  name: PropTypes.string.isRequired,
  validate: PropTypes.arrayOf(PropTypes.func),
  onChange: PropTypes.func,
  onBlur: PropTypes.func,
  className: PropTypes.string,
  margin: PropTypes.string
};

export default withStyles(styles)(connectField(TextFieldCustom))
