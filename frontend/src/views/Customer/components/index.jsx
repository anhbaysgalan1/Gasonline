import React from 'react';
import SelectField, {Option} from 'components/Forms/SelectField';
import RadioGroupField, {Radio} from 'components/Forms/RadioGroupField';
import {customerFlags, customerPaymentTerms, customerTypes} from 'config/constant';
import {I18n} from 'helpers/I18n';

const defaultValue = '15';
const renderRadioOptions = (dataTypes, readOnly = false, onChange = null) => {
  return dataTypes.map(item => {
    return <Radio
      key={item.value}
      label={item.label}
      value={item.value}
      disabled={readOnly}
      onChange={(e) => {
        let {value} = e.target;
        if (onChange) onChange(value)
        return value
      }}
    />
  })
}

const renderRadioTypes = (dataTypes, name, value, readOnly = false, onChange = null) => {
  return <RadioGroupField
    row={true}
    name={name}
    label={I18n.t(`Input.customer.${name}`)}
    value={value}
    fullWidth
  >
    {renderRadioOptions(dataTypes, readOnly, onChange)}
  </RadioGroupField>
}

const renderPaymentTermOptions = () => {
  return customerPaymentTerms.map(item => <Option value={item.value} key={item.value}>{item.text}</Option>)
}

export const renderPaymentTermSelectField = (value = defaultValue, readOnly = false) => {
  return <SelectField
    value={value}
    fullWidth
    name="paymentTerm"
    label={I18n.t("Input.customer.paymentTerm")}
    disabled={readOnly}
  >
    {renderPaymentTermOptions()}
  </SelectField>
}

export const renderCustomerTypeRadio = (value = 1, readOnly = false, onChange = null) => {
  value = value ? value.toString() : ''
  return renderRadioTypes(customerTypes, 'type', value, readOnly, onChange)
}

export const renderCustomerFlagRadio = (value = "A", readOnly = false) => {
  return renderRadioTypes(customerFlags, 'flag', value, readOnly)
}
