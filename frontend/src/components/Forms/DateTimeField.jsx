import React from 'react';
import PropTypes from 'prop-types';
import withStyles from '@material-ui/core/styles/withStyles';
import BaseField from './BaseField';
import {connectField} from './Connect';
import DateFnsUtils from '@date-io/moment';
import {
  DatePicker,
  DateTimePicker,
  KeyboardDatePicker,
  KeyboardDateTimePicker,
  KeyboardTimePicker,
  MuiPickersUtilsProvider,
  TimePicker
} from '@material-ui/pickers';

import {locale} from "config/constant";
import {I18n} from 'helpers/I18n';
import moment from 'moment';
import 'moment/locale/ja';
import 'moment/locale/vi';

const debug = require("debug")("mq:form:DateTimeField")
moment.locale(locale);

const styles = theme => ({})

class DateTimeField extends BaseField {
  constructor(props) {
    super(props)
    this.state = {
      ...this.state,
      value: props.value || null
    }
  }

  render() {
    debug("render DatetimeField: ", this.props.name)
    let {onChange, onBlur, margin, defaultValue, name, showDate, showTime, value, keyboard, ...otherProps} = this.propsRemovedIgrone()
    let Component = DateTimePicker
    if (keyboard == null) keyboard = true
    if (keyboard === true) {
      Component = KeyboardDateTimePicker
    }
    if (!showDate && showTime) {
      Component = TimePicker
      if (keyboard === true) {
        Component = KeyboardTimePicker
      }
    } else if (!showTime && showDate) {
      Component = DatePicker
      if (keyboard === true) {
        Component = KeyboardDatePicker
      }
    }
    return (
      <MuiPickersUtilsProvider utils={DateFnsUtils} locale={locale}>
        <Component
          {...otherProps}
          name={name}
          error={this.state.error ? true : false}
          helperText={this.state.error}
          margin={margin || "normal"}
          value={this.state.value}
          onChange={value => this.onChange(value)}
          onBlur={e => this.onBlur(e)}
          cancelLabel={I18n.t("Button.cancel")}
          okLabel={I18n.t("Button.ok")}
        />
      </MuiPickersUtilsProvider>
    )
  }
}

DateTimeField.propTypes = {
  label: PropTypes.string,
  name: PropTypes.string.isRequired,
  validate: PropTypes.arrayOf(PropTypes.func),
  onChange: PropTypes.func,
  onBlur: PropTypes.func,
  className: PropTypes.string,
  margin: PropTypes.string,
  showTime: PropTypes.bool,
  showDate: PropTypes.bool,
};

DateTimeField.defaultProps = {
  showTime: true,
  showDate: true
}

export default withStyles(styles)(connectField(DateTimeField))
