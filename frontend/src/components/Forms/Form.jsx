import React, {Component} from 'react';
import {FormProvider} from './Connect'
import _ from 'lodash'

const debug = require("debug")("mq:form:Form")

class FormCustom extends Component {
  constructor(props) {
    super(props)
    this.state = {}
  }

  /**
   * Gọi lại hàm validate từng input. Kiểm tra toàn bộ input trong form đã hợp lệ chưa.
   */
  async validateForm() {
    const {registeredField} = this.provider
    let errorsAsync = {
      name: [],
      error: []
    }
    //validate lại tất cả các input
    for (let field in registeredField) {
      if (registeredField[field]) {
        const input = registeredField[field]
        errorsAsync["name"].push(input.props.name)
        errorsAsync["error"].push(input.getError())
      }
    }
    errorsAsync["error"] = await Promise.all(errorsAsync["error"])
    //build lại object error
    let errors = {}
    for (let i in errorsAsync["name"]) {
      if (errorsAsync["error"][i] !== undefined) {
        errors[errorsAsync["name"][i]] = errorsAsync["error"][i]
      }
    }
    return errors
  }

  /**
   * lấy dữ liệu input trong form
   */
  getValue() {
    const {registeredField} = this.provider // lấy từ context đc build ở class Connect
    let result = {}
    for (let field in registeredField) {
      if (registeredField[field]) {
        const input = registeredField[field];
        _.set(result, input.props.name, input.getValue()) //set dữ liệu vào object
      }
    }
    return result
  }

  async onSubmit(e) {
    e.preventDefault()
    const errors = await this.validateForm()
    const values = this.getValue();
    debug("submit validate error:", errors)
    debug("submit values: ", values)
    if (this.props.onSubmit && Object.keys(errors).length === 0) {
      this.props.onSubmit(values)
    }
  }

  render() {
    const {children, ...otherProps} = this.props
    return (
      <FormProvider form={this}>
        <form  {...otherProps} onSubmit={e => this.onSubmit(e)}>
          {children}
        </form>
      </FormProvider>
    )
  }
}

export default FormCustom
