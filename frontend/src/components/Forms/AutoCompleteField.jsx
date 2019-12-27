import React from 'react'
import PropTypes from 'prop-types'
import classNames from 'classnames'
import withStyles from '@material-ui/core/styles/withStyles'
import Typography from '@material-ui/core/Typography'
import Chip from '@material-ui/core/Chip'
import Paper from '@material-ui/core/Paper'
import TextField from '@material-ui/core/TextField'
import MenuItem from '@material-ui/core/MenuItem'
import Checkbox from '@material-ui/core/Checkbox'
import ListItemText from '@material-ui/core/ListItemText'
import CancelIcon from '@material-ui/icons/Cancel'
import { emphasize } from '@material-ui/core/styles/colorManipulator'
import Select from 'react-select'
import BaseField from './BaseField'
import { connectField } from './Connect'
import {I18n} from 'helpers/I18n';
import _ from 'lodash'

const debug = require("debug")("mq:form:AutoCompleteField")
const styles = theme => ({
  input: {
    display: 'flex',
    //padding: 0,
  },
  valueContainer: {
    display: 'flex',
    flexWrap: 'wrap',
    flex: 1,
    alignItems: 'center',
    overflow: 'hidden'
  },
  chip: {
    margin: theme.spacing.unit / 4,
  },
  chipFocused: {
    backgroundColor: emphasize(
      theme.palette.type === 'light' ? theme.palette.grey[300] : theme.palette.grey[700],
      0.08,
    ),
  },
  noOptionsMessage: {
    padding: `${theme.spacing.unit}px ${theme.spacing.unit * 2}px`,
  },
  singleValue: {
    fontSize: 16,
    lineHeight: 1
  },
  placeholder: {
    position: 'absolute',
    left: 2,
    fontSize: 16,
  },
  paper: {
    position: 'absolute',
    zIndex: 999,
    marginTop: theme.spacing.unit,
    left: 0,
    right: 0,
  },
  divider: {
    height: theme.spacing.unit * 2,
  },
})

function NoOptionsMessage(props) {
  return (
    <Typography
      color="textSecondary"
      className={props.selectProps.classes.noOptionsMessage}
      {...props.innerProps}
    >
      {I18n.t("Form.noOption")}
    </Typography>
  );
}

function inputComponent({ inputRef, ...props }) {
  return <div ref={inputRef} {...props} />;
}

function Control(props) {
  return (
    <TextField
      fullWidth
      margin={props.selectProps.margin || "normal"}
      style={{
        //height: "32px"
      }}
      {...props.selectProps.textFieldProps}
      InputProps={{
        inputComponent,
        inputProps: {
          className: props.selectProps.classes.input,
          inputRef: props.innerRef,
          children: props.children,
          ...props.innerProps,
        },
      }}
      InputLabelProps={{
        ...props.selectProps.textFieldProps.InputLabelProps,
        shrink: props.isFocused || props.selectProps.textFieldProps.InputLabelProps.shrink,
      }}
    />
  );
}

function Options(props) {
  return (
    <MenuItem
      buttonRef={props.innerRef}
      selected={props.isSelected}
      component="div"
      style={{
        fontWeight: props.isSelected ? 500 : 400,
      }}
      {...props.innerProps}
    >
      {props.selectProps.showOptionCheckbox ? <Checkbox checked={props.isSelected} /> : ''}
      <ListItemText primary={props.children} />
    </MenuItem>
  );
}

function Placeholder(props) {
  if (props.selectProps.textFieldProps.label) return ""
  return (
    <Typography
      color="textSecondary"
      className={props.selectProps.classes.placeholder}
      {...props.innerProps}
    >
      {props.children}
    </Typography>
  );
}

function SingleValue(props) {
  return (
    <Typography className={props.selectProps.classes.singleValue} {...props.innerProps}>
      {props.children}
    </Typography>
  );
}

function ValueContainer(props) {
  return <div className={props.selectProps.classes.valueContainer} >{props.children}</div>;
}

function handleDelete(data) {
  let arr = data.selectProps.dataCheckIn
  let currentValue = data.data.value
  if (Array.isArray(arr)) {
    if (arr.length) {
      for (let i of arr) {
        if (i.userId == currentValue) {
          return
        }
      }
    }
  }
  return data.removeProps.onClick
}

function MultiValue(props) {
  return (
    <Chip
      key={props.data.value}
      tabIndex={-1}
      label={props.children}
      className={classNames(props.selectProps.classes.chip, {
        [props.selectProps.classes.chipFocused]: props.isFocused,
      })}
      onDelete={handleDelete(props)}
      deleteIcon={<CancelIcon {...props.removeProps} />}
    />
  );
}

function Menu(props) {
  return (
    <Paper square className={props.selectProps.classes.paper} {...props.innerProps}>
      {props.children}
    </Paper>
  );
}

const components = {
  Control,
  Menu,
  MultiValue,
  NoOptionsMessage,
  Option: Options,
  Placeholder,
  SingleValue,
  ValueContainer,
};

class AutocompleteField extends BaseField {
  constructor(props) {
    super(props)
    this.state = {
      ...this.state,
      reload: false,
      test: true,
      defaultValue: this.getOptionByValue(props.defaultValue),
      value: this.setValue(props)
    }
  }

  setValue(props) {
    return props.value ? this.getOptionByValue(props.value)
      : props.defaultValue ? this.getOptionByValue(props.defaultValue)
        : null
  }

  componentDidUpdate(prevProps) {
    let props = this.props
    if (props.children.length !== prevProps.children.length ||
      !_.isEqual(props.value, prevProps.value) ||
        !_.isEqual(props.defaultValue, prevProps.defaultValue)) {
      this.setState({
        reload: !this.state.reload,
        value: this.setValue(props)
      });
    }
  }

  setDefaultValue(defaultValue, modifiedAt) {
    if (defaultValue == null) return
    defaultValue = this.getOptionByValue(defaultValue)
    this.setState({
      defaultValue: defaultValue,
      [this.valueField]: defaultValue,
      modifiedAt: {
        ...this.state.modifiedAt, //sử dụng thời gian để check sự thay đổi của value và error
        defaultValue: modifiedAt
      }
    }, () => {
      this.onValidate()
    })
  }

  getValue() {
    if (!this.props.isMulti) {
      return _.get(this.state, "value.value", null)
    }
    else {
      return this.state.value.map(option => option.value)
    }
  }

  getOptionByValue(value) {
    const { children, isMulti } = this.props
    const options = React.Children.map(children, child => ({ value: child.props.value, label: child.props.children })) || []

    if (!isMulti) {
      // if(value.value) value = value.value //kiểm tra nếu truyền vào là object
      const option = options.filter(option => option.value === value)
      if (option.length > 0) return option[0]
      return {
        value: value,
        label: '',
      }
    }
    else {
      if (!value || value.length === 0) return []
      if (value[0].value) value = value.map(value => value.value) //kiểm tra nếu truyền vào là object
      const option = options.filter(option => value.includes(option.value))
      if (option.length > 0) return option
      return []
    }
  }

  /**
   * Kiểm tra input có đang có dữ liệu hay không, ảnh hưởng đến hiển thị của label
   */
  isShrink() {
    const value = this.state.value
    const isMulti = this.props.isMulti
    if (!isMulti) {
      return value ? true : false
    }
    return this.state.value.length > 0 ? true : false
  }

  render() {
    debug("render AutocompleteField:", this.props.name)
    const { label, children, ...otherProps } = this.props
    let showOptionCheckbox = this.props.showOptionCheckbox
    //lấy list options từ các Component con
    const options = React.Children.map(children, child => {
      if (child.props.showCheckbox === true) showOptionCheckbox = true
      return {
        value: child.props.value,
        label: child.props.children
      }
    })
    let value = this.state.value || [];

    return (
      <Select
        isClearable //hiển thị nut X để clear select
        closeMenuOnSelect={!this.props.isMulti} //tự tắt menu khi chọn 1 option
        hideSelectedOptions={false} //ẩn selected option trong multi
        options={[...options]} //danh sách các options {value:'xxx', label: 'yyy'}
        {...otherProps} //các props khác từ ngoài
        isDisabled={this.props.isDisabled}
        showOptionCheckbox={showOptionCheckbox} //hiển thị checkbox ở cột đầu tiên
        textFieldProps={{ //props riêng cho ô input
          ...otherProps.textFieldProps,
          label: label,
          error: this.state.error ? true : false, //error=true text sẽ là màu đỏ
          helperText: this.state.error, //nội dung lỗi phía dưới input
          InputLabelProps: { //props riêng cho label
            shrink: this.isShrink() //có nội dung ở input hay không
          }
        }}
        components={components} //các sub component của thư viện, thay đổi giao diện theo material-ui
        value={value}
        onChange={e => this.onChange(e)}
        styles={{
          clearIndicator: () => ({
            padding: "0px 8px",
            height: "19px"
          }),
          dropdownIndicator: () => ({
            padding: "0px 8px",
            height: "19px",
          }),
          input: () => ({
            padding: "0px"
          })
        }}
      />
    )
  }
}
AutocompleteField.propTypes = {
  label: PropTypes.string,
  name: PropTypes.string.isRequired,

  validate: PropTypes.arrayOf(PropTypes.func),
  onChange: PropTypes.func,
  onBlur: PropTypes.func,
  className: PropTypes.string,
  margin: PropTypes.string
};

/**
 * Option cho select phía trên
 */
class Option extends React.Component {
  render() {
    const { children, ...otherProps } = this.props
    return (
      <MenuItem {...otherProps}> {children} </MenuItem>
    )
  }
}

export {
  Option
}

AutocompleteField.Option = Option
export default withStyles(styles)(connectField(AutocompleteField))
