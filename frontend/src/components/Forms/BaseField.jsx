import {PureComponent} from 'react';
import PropTypes from 'prop-types';

const debug = require("debug")("mq:form:field")

/**
 * Field cơ sở cho tất cả các field trong form khác kế thừa.
 * xử lý 1 số vấn đề đặc biệt dữ truyền dữ liệu và validate trong form.
 */
class BaseField extends PureComponent {
  constructor(props) {
    super(props)
    this.valueField = "value"
    this.state = {
      error: props.error || undefined, //nội dung thông báo lỗi
      oldError: props.error || undefined, //nội dung lỗi cũ

      touched: false, //đã chạm vào input hay chưa
      [this.valueField]: props[this.valueField] != null ? props[this.valueField] : props.defaultValue != null ? props.defaultValue : "", //giá trị của field
      defaultValue: props.defaultValue != null ? props.defaultValue : "", //giá trị mặc định
      modifiedAt: { //thời gian thay đổi value và error, sử dụng để kiêm tra tính thay đổi
        error: new Date(0),
        value: new Date(0)
      }
    }
    if (props.forwardRef) props.forwardRef(this) //forward ref ra component cha
    this.onChange = this.onChange.bind(this)
    this.onBlur = this.onBlur.bind(this)
  }

  /**
   * Xóa bỏ 1 số hàm, thuộc tính không muốn truyền từ ngoài vào khỏi props,
   */
  propsRemovedIgrone() {
    const {
      onChange,
      onBlur,
      forwardRef,
      errorModified,
      ...otherProps
    } = this.props
    return otherProps
  }

  componentDidUpdate(prevProps, prevState) {
    //kiểm tra có thay đổi giá trị từ props truyền vào hay không
    if (this.props.defaultValue != null &&
      (prevProps.defaultValue !== this.props.defaultValue ||
        prevProps.defaultValueModified !== this.props.defaultValueModified)) {
      this.setDefaultValue(this.props.defaultValue)
    }

    //kiểm tra thay đổi value từ component cha thì update
    if (this.props[this.valueField] != null && this.props[this.valueField] !== prevProps[this.valueField]) {
      this.onChange(this.props[this.valueField])
    }

    //kiểm tra có error truyền vào hay không
    if (this.props.error && (this.state.oldError !== this.props.error || this.state.modifiedAt.error !== this.props.errorModified)) {
      this.setError(this.props.error, this.props.errorModified)
    }
  }

  /**
   * validate dữ liệu của input
   */
  onValidate() {
    const {validate} = this.props
    const value = this.state[this.valueField]
    if (!validate) return

    let error = undefined
    //for mảng các hàm validate, cho dữ liệu qua từng hàm để kiểm tra validate
    for (let func of validate) {
      error = func(value) //trả về nội dung lỗi nếu có
      if (error) break;
    }

    if (error !== this.state.error) {
      this.setState({error: error})
    }
    debug("validate has error: ", error)
    return error
  }

  /**
   * Thay đổi value của input, gọi hàm validate
   * callback hàm onChange của Component cha
   */
  onChange(value) {
    debug("onChange, new Value:", value)

    if (typeof this.props.formatData === 'function') {
      value = this.props.formatData(value)
    }
    //không sử dụng hàm setValue, setValue chỉ sử dụng cho việc set biến giá trị từ ngoài vào.
    this.setState({[this.valueField]: value}, () => {
      this.onValidate() //validate
    })

    if (this.props.onChange) {//gọi hàm callback trong props nếu có
      this.props.onChange(value)
    }
  }

  /**
   * Validate khi rời khỏi input
   */
  onBlur(e) {
    debug("onBlur, touched:", this.state.touched)
    if (this.state.touched === false) {
      this.onValidate() //validate
      this.setState({touched: true})
    }

    if (this.props.onBlur) {
      this.props.onBlur(e)
    }
  }

  getValue() {
    return this.state[this.valueField]
  }

  /**
   * gán ngược giá trị cho Field, sử dụng gọi từ ngoài component vào qua ref.
   * Nếu là thay đổi nội bộ do người dùng gõ, sử dụng onChange
   */
  setDefaultValue(defaultValue, modifiedAt) {
    this.setState({
      defaultValue: defaultValue,
      [this.valueField]: defaultValue,
      modifiedAt: {
        ...this.state.modifiedAt,
        defaultValue: modifiedAt
      }
    }, () => {
      this.onValidate()
    })
  }

  //lấy thông báo lỗi của input (sử dụng trong submit form)
  async getError() {
    if (!this.state.touched) {
      return this.onValidate()
    } else {
      return this.state.error
    }
  }

  setError(error, modifiedAt) {
    error = error ? error : ""
    this.setState({
      oldError: error,
      error: error,
      modifiedAt: {
        ...this.state.modifiedAt,
        error: modifiedAt
      }
    })
  }

  /**
   * Gọi FormConsumer để đăng ký field này với form
   */
  render() {
    console.error("render method is required.")
    return ""
  }
}

BaseField.propTypes = {
  label: PropTypes.string.isRequired,
  name: PropTypes.string.isRequired,
  validate: PropTypes.arrayOf(PropTypes.func),
  onChange: PropTypes.func,
  onBlur: PropTypes.func,
  className: PropTypes.string,
  margin: PropTypes.string
};

export default BaseField
