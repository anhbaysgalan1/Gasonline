import React, {Component} from 'react';
import PropTypes from 'prop-types';
import Avatar from '@material-ui/core/Avatar';
import Button from '@material-ui/core/Button';

import LockIcon from '@material-ui/icons/LockOutlined';
import Paper from '@material-ui/core/Paper';
import Typography from '@material-ui/core/Typography';
import withStyles from '@material-ui/core/styles/withStyles';
import TextField from 'components/Forms/TextField';
import SelectField from 'components/Forms/SelectField';
import DateTimeField from 'components/Forms/DateTimeField'
import CheckboxField from 'components/Forms/CheckboxField'
import SwitchField from 'components/Forms/SwitchField'
import MultipleSelectField, {Option as OptionSelect} from 'components/Forms/MultipleSelectField'
import AutoCompleteField, {Option as OptionAuto} from 'components/Forms/AutoCompleteField'
import RadioGroupField, {Radio} from 'components/Forms/RadioGroupField'
import Form from 'components/Forms/Form';

const styles = theme => ({
  paper: {
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    padding: `${theme.spacing(2)}px ${theme.spacing(3)}px ${theme.spacing(3)}px`,
  },
  avatar: {
    margin: theme.spacing(1),
    backgroundColor: theme.palette.secondary.main,
  },
  form: {
    width: '100%', // Fix IE 11 issue.
    marginTop: theme.spacing(1),
  },
  submit: {
    marginTop: theme.spacing(3),
  },
});
const required = function (value) {
  if (!value || value.length === 0) {
    return "required!"
  }
}
const min = function (minValue, message) {
  return (value) => {
    if (parseInt(value) < minValue) return message
  }
}
const currencies = [
  {
    value: 'USD',
    label: 'ngọc',
  },
  {
    value: 'EUR',
    label: 'sensor',
  },
  {
    value: 'BTC',
    label: 'bách khoa',
  },
  {
    value: 'JPY',
    label: '¥',
  },
];

class Login extends Component {
  constructor(props) {
    super(props)
    this.state = {
      a: "default value for text field"
    }
  }

  render() {
    let {classes} = this.props
    return <Paper className={classes.paper}>
      <Avatar className={classes.avatar}>
        <LockIcon/>
      </Avatar>
      <Typography component="h1" variant="h5">
        Sign in
      </Typography>
      <Form className={classes.form} onSubmit={(values, errors) => {
        console.log("submit", values, errors)
      }}>
        {/**
         TextField sử dụng làm các input, set giá trị cho input bằng biến value hoặc gọi hàm setValue của ref.
         validate là mảng các hàm validate, mỗi hàm sẽ trả về message nếu lỗi, hoặc undefined nếu không lỗi.
         */}
        <TextField
          fullWidth
          label="TextField"
          name="textFiledA"
          value={this.state.a}
          onChange={(e) => {
          }}
          validate={[required]}
        />
        <TextField
          fullWidth
          label="Textfield number, validate min 10"
          name="textFiledNumber"
          type="number"
          validate={[required, min(10, "vui lòng nhập giá trị tối thiếu bằng 10")]}
        />

        {/**
         SelectField:
         Mỗi 1 option là 1 MenuItem
         */}
        <SelectField
          fullWidth
          select
          label="Select Field"
          name="selectField"
          onChange={(value) => {
          }}
          value="EUR"
          validate={[required, min(10, "x phải lớn hơn 10")]}
        >
          {currencies.map(option => (
            <OptionSelect key={option.value} value={option.value}>
              {option.label}
            </OptionSelect>
          ))}
        </SelectField>

        {/**
         MultipleSelectField:
         Cho phép chọn nhiều item,
         value truyền vào phải là mảng
         Option có thể hiển thị checkbox bằng cách thêm showCheckbox={true}
         */}
        <MultipleSelectField
          fullWidth
          select
          label="Multiple Select"
          name="multipleSelect"
          onChange={(value) => {
          }}
          value={["EUR"]}
          validate={[required]}
        >
          {currencies.map(option => (
            <OptionSelect key={option.value} value={option.value} showCheckbox={true}>
              {option.label}
            </OptionSelect>
          ))}
        </MultipleSelectField>

        {/**
         AutoCompleteField:
         Dạng giống selectbox, nhưng mở rộng hơn, cho phép search, và nhiều tùy chọn xem ở:
         https://react-select.com
         */}

        <AutoCompleteField
          key="1"
          fullWidth
          select
          label="AutoCompleteField"
          name="autocomplete"
          onChange={(value) => {
          }}
          value={"EUR"}
          validate={[required]}
        >
          {currencies.map(option => (
            <OptionAuto key={option.value} value={option.value}>
              {option.label}
            </OptionAuto>
          ))}
        </AutoCompleteField>
        {/**
         AutoCompleteField:
         truyền thêm props isMulti nếu muốn cho multi select, value truyền vào phải là 1 array.
         Option muốn hiển thị checkbox thì set props showCheckbox=true
         */}
        <AutoCompleteField
          key="2"
          fullWidth
          select
          label="Autocomplete Multi select"
          name="autocomplete"
          onChange={(value) => {
          }}
          value={["EUR"]}
          validate={[required, min(10, "x phải lớn hơn 10")]}
          isMulti
        >
          {currencies.map(option => (
            <OptionAuto key={option.value} value={option.value} showCheckbox={true}>
              {option.label}
            </OptionAuto>
          ))}
        </AutoCompleteField>

        {/**
         DateTimeField:
         sử dụng để chọn ngày tháng
         sử dụng showTime, showDate để tùy chỉnh hiển thị chọn ngày và giờ hay không.
         tham khảo thêm các props ở https://material-ui-pickers.firebaseapp.com/
         */}
        <DateTimeField
          fullWidth
          label="DateTime picker"
          name="datetime"
          ampm={false}
          clearable={true}
          autoOk={true}
          showTime={true}
          showDate={false}
        />

        {/**
         CheckboxField:
         xem thêm https://material-ui.com/demos/selection-controls/
         */}
        <CheckboxField
          label="Kiểm thử checkbox"
          name="checkbox"
          checked={true}
        />

        {/**
         SwitchField:
         xem thêm https://material-ui.com/demos/selection-controls/
         */}
        <SwitchField
          label="Kiểm thử checkbox"
          name="switch"
          checked={true}
        />

        {/**
         RadioGroupField:
         tạo ra 1 nhóm các Radio, sử dụng Radio bên trong để thêm tùy chọn
         */}
        <RadioGroupField name="radio" label="Radio Group" value="1" fullWidth>
          <Radio
            label="Kiểm thử Radio1"
            value="1"
          />
          <Radio
            label="Kiểm thử Radio2"
            value="2"
          />
          <Radio
            label="Kiểm thử Radio3"
            value="3"
          />
        </RadioGroupField>
        <Button
          type="submit"
          fullWidth
          variant="contained"
          color="primary"
          // onClick={e => this.onClick(e)}
        >
          Sign in
        </Button>
      </Form>

    </Paper>
  }
}

Login.propTypes = {
  classes: PropTypes.object.isRequired,
};

export default withStyles(styles)(Login);
