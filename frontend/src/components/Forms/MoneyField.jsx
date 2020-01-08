import React from 'react';
import PropTypes from 'prop-types';
import withStyles from '@material-ui/core/styles/withStyles';
import TextField from '@material-ui/core/TextField';
import BaseField from './BaseField';
import { connectField } from './Connect'

const debug = require("debug")("mq:form:MoneyField")
const styles = theme => ({
    textField: {
    },
    'input': {
        '&::placeholder': {
            fontSize: "14px !important",
        }
    }
})
class MoneyField extends BaseField {
    constructor(props) {
        super(props)
        this.state = {
            ...this.state,
            defaultValue: this.formatMoney(props.defaultValue || props.value)
        };
        this._value = this.formatMoney(props.defaultValue || props.value)
    }

    onChange = (value) => {
        this._value = this.formatMoney(value);
        value = this.validateLength(value)
        super.onChange(value)
    }
    //chỉ nhận 12 chữ số
    validateLength  = (number) => {
        number = String(number).replace(/[^0-9]/g, "");
        if(!number) return ''
        number = String(parseInt(number, 10));
        if(number === '0') return ''
        number = number.substring(0, 12);
        return number
    }
    
    formatMoney = (_value) => {
        if(!_value) return ''
        _value = this.validateLength(_value)
        return String(_value).replace(/(\d)(?=(\d{3})+(?!\d))/g, "$1,");
    }

    render() {
        debug("render TextField: ", this.props.name)
        debug("props: ", this.props)
        const { margin, defaultValue, classes, className, name, InputProps,...otherProps } = this.propsRemovedIgrone()
        return (
            <TextField
                {...otherProps}
                name={name}
                error={this.state.error ? true : false}
                helperText={this.state.error}
                className={`${classes.TextField} ${className}`}
                inputRef={ref => this.ref = ref}
                margin={margin || "normal"}
                value={this._value}
                onChange={e => this.onChange(e.target.value)}
                onBlur={e => this.onBlur(e)}
                InputProps={{ classes: {input: classes['input']}, ...InputProps }}
            />
        )
    }
}
MoneyField.propTypes = {
    label: PropTypes.string,
    name: PropTypes.string.isRequired,
    validate: PropTypes.arrayOf(PropTypes.func),
    onChange: PropTypes.func,
    onBlur: PropTypes.func,
    className: PropTypes.string,
    margin: PropTypes.string
}

export default withStyles(styles)(connectField(MoneyField))