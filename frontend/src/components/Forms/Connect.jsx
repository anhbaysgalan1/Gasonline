import React from 'react';
import PropTypes from 'prop-types';

const debug = require("debug")("mq:form:Connect")
const FormContext = React.createContext();

/**
 * Class chức năng của form
 * sử dụng để tạo ra sự liên kết giữa form và các input trong form
 * sử dụng Provider vs Consumer để truyền dữ liệu.
 */
class FormProvider extends React.Component {
  constructor(props) {
    super(props)
    this.registeredField = {} //các field đã đăng ký
    props.form.provider = this;
  }

  /**
   * Đăng ký field với form
   */
  registerField(fieldName, field) {
    debug("registerField", fieldName)
    this.registeredField[fieldName] = field
  }

  render() {
    return (
      <FormContext.Provider
        value={{
          registerField: this.registerField.bind(this),
          registeredField: this.registeredField
        }}
      >
        {this.props.children}
      </FormContext.Provider>
    );
  }
}

class FormConsumer extends React.Component {
  render() {
    const {children, name} = this.props;
    return (
      <FormContext.Consumer>
        {({registeredField, registerField} = {}) =>
          React.Children.map(children, child =>
            React.cloneElement(child, {
              ref: ref => {
                if (!registeredField || !registerField) return
                registerField(name, ref)
              }
            })
          )
        }
      </FormContext.Consumer>
    );
  }
}

/**
 * Sử dụng hàm này để kết nối các input với form, sử dụng Provider vs Consumer để truyền dữ liệu trong form
 */
const connectField = (Component) => (props) => {
  const {...otherProps} = props
  return (
    <FormConsumer name={props.name}>
      <Component {...otherProps} />
    </FormConsumer>
  )
}

FormProvider.propTypes = {
  form: PropTypes.object.isRequired
};

FormConsumer.propTypes = {
  name: PropTypes.string.isRequired
};

export {
  FormProvider,
  FormConsumer,
  connectField
}
