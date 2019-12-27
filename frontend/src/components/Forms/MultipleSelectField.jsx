import React from 'react'
import PropTypes from 'prop-types';
import withStyles from '@material-ui/core/styles/withStyles';
import Chip from '@material-ui/core/Chip';
import BaseField from './BaseField';
import {connectField} from './Connect'
import TextField from '@material-ui/core/TextField';
import MenuItem from '@material-ui/core/MenuItem'
import Checkbox from '@material-ui/core/Checkbox'
import ListItemText from '@material-ui/core/ListItemText'

const debug = require("debug")("mq:form:MultipleSelectField")
const styles = theme => ({
  textField: {},
  chips: {
    display: 'flex',
    flexWrap: 'wrap',
  },
  chip: {
    margin: theme.spacing(0.25),
  },
})

class MultipleSelectField extends BaseField {
  constructor(props) {
    super(props)
    this.state = {
      ...this.state,
      value: props.value || []
    }
  }

  findLabelByValue(value) {
    const {children} = this.props
    const options = React.Children.map(children, child => ({value: child.props.value, label: child.props.children}))
    const option = options.filter(option => option.value === value)
    if (option.length > 0) return option[0].label;
    return value
  }

  renderValue(selected) {
    const {classes} = this.props
    return (<div className={classes.chips}>
      {
        selected.map(value => (<Chip key={value} label={this.findLabelByValue(value)} className={classes.chip}/>))
      }
    </div>)
  }

  render() {
    debug("render MultipleSelectField: ", this.props.name)
    const {classes, className, margin, children, onChange, ...otherProps} = this.props
    return (
      <TextField
        {...otherProps}
        children={children}
        error={this.state.error ? true : false}
        helperText={this.state.error}
        className={`${classes.TextField} ${className}`}
        inputRef={ref => this.ref = ref}
        margin={margin || "normal"}
        value={this.state.value}
        onChange={e => this.onChange(e.target.value)}
        onBlur={e => this.onBlur(e)}
        SelectProps={{
          multiple: true,
          renderValue: (selected) => this.renderValue(selected)
        }}
      />
    )
  }
}

MultipleSelectField.propTypes = {
  label: PropTypes.string.isRequired,
  name: PropTypes.string.isRequired,
  validate: PropTypes.arrayOf(PropTypes.func),
  onChange: PropTypes.func,
  onBlur: PropTypes.func,
  className: PropTypes.string,
  margin: PropTypes.string
};

export default withStyles(styles)(connectField(MultipleSelectField))


class Option extends React.Component {
  render() {
    const {children, selected, CheckboxProps, ListItemTextProps, showCheckbox, ...otherProps} = this.props
    return (
      <MenuItem
        selected={selected}
        {...otherProps}
      >
        {showCheckbox ? <Checkbox {...CheckboxProps} checked={selected}/> : ''}
        <ListItemText {...ListItemTextProps} primary={children}/>
      </MenuItem>
    )
  }
}

export {
  Option
}
