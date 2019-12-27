import React from 'react'
import BaseField from './BaseField';
import PropTypes from 'prop-types';
import withStyles from '@material-ui/core/styles/withStyles';
import TextField from './TextField';
import MenuItem from '@material-ui/core/MenuItem'
import ListItemText from '@material-ui/core/ListItemText'

//const debug = require("debug")("mq:form:SelectField")
const styles = theme => ({
  textField: {},
})

class SelectField extends BaseField {
  render() {
    return <TextField
      {...this.props}
      select
    />
  }
}

SelectField.propTypes = {
  label: PropTypes.string,
  name: PropTypes.string.isRequired,
  validate: PropTypes.arrayOf(PropTypes.func),
  onChange: PropTypes.func,
  onBlur: PropTypes.func,
  className: PropTypes.string,
  margin: PropTypes.string
};

export default withStyles(styles)(SelectField)


class Option extends React.Component {
  render() {
    const {children, selected, CheckboxProps, ListItemTextProps, showCheckbox, ...otherProps} = this.props
    return (
      <MenuItem
        selected={selected}
        {...otherProps}
      >
        <ListItemText {...ListItemTextProps} primary={children}/>
      </MenuItem>
    )
  }
}

export {
  Option
}
