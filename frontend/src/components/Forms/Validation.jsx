export const required = (message = "required!") => value => {
  if(value && value.length){
    value = value.toString()
    value = value.replace(/ /g, '')
    if(value == ' ')
      return message
  }
  if (!value || value.length === 0 || value === '') {
    return message
  }
  // if (!value || value.length === 0) {
  //   return message
  // }
}
// eslint-disable-next-line
export const min = (minValue, message = "The minimum value is ${arguments[0]}") => {
  try {
    // eslint-disable-next-line
    eval(`message=\`${message}\``)
  } catch (e) {
    console.error("can not build message for min function.")
  }
  return value => {
    if (parseInt(value) < minValue) return message
  }
}

// eslint-disable-next-line
export const max = (maxValue, message = "The maximum value is ${arguments[0]}") => {
  try {
    // eslint-disable-next-line
    eval(`message=\`${message}\``)
  } catch (e) {
    console.error("can not build message for max function.")
  }
  return value => {
    if (parseInt(value) > maxValue) return message
  }
}

// eslint-disable-next-line
export const greaterThan = (minValue, message = "Value must be greater than ${arguments[0]}") => {
  try {
    // eslint-disable-next-line
    eval(`message=\`${message}\``)
  } catch (e) {
    console.error("can not build message for greaterThan function.")
  }
  return value => {
    if (parseInt(value) <= minValue) return message
  }
}

// eslint-disable-next-line
export const lessThan = (maxValue, message = "Value must be less than ${arguments[0]}") => {
  try {
    // eslint-disable-next-line
    eval(`message=\`${message}\``)
  } catch (e) {
    console.error("can not build message for lessThan function.")
  }
  return value => {
    if (parseInt(value) >= maxValue) return message
  }
}

// eslint-disable-next-line
export const minLength = (minLength, message = "The minimum length is ${arguments[0]}") => {
  try {
    // eslint-disable-next-line
    eval(`message=\`${message}\``)
  } catch (e) {
    console.error("can not build message for minLength function.")
  }
  return value => {
    if (String(value).length < minLength) return message
  }
}

// eslint-disable-next-line
export const maxLength = (maxLength, message = "The maximum length is ${arguments[0]}") => {
  try {
    // eslint-disable-next-line
    eval(`message=\`${message}\``)
  } catch (e) {
    console.error("can not build message for maxLength function.")
  }
  return value => {
    if (String(value).length > maxLength) return message
  }
}

export const equalPass = (password, message = "Mật khẩu không trùng khớp") => {
  try {
    // eslint-disable-next-line
    eval(`message=\`${message}\``)
  } catch (e) {
    console.error("can not build message for maxLength function.")
  }
  return value => {
    if (String(value) !== String(password)) return message
  }
}

export const validateEmail = (message = "Email nhập không đúng định dạng") => value => {
  if (!String(value).match(/^([a-zA-Z0-9_\-\.]+)@([a-zA-Z0-9_\-\.]+)\.([a-zA-Z]{2,5})$/)) return message
}

export const checkDateTime = (minDate, message1 = "Ngày không hợp lệ", message2 = "Nhập ngày lớn hơn ngày tối thiểu ${arguments[0]}") => {
  try {
    // eslint-disable-next-line
    eval(`message1=\`${message1}\``)
    eval(`message2=\`${message2}\``)
  } catch (e) {
    console.error("can not build message for maxLength function.")
  }
  return value => {
    // console.log("valid date: ", value)
    if (typeof value === "object" && !value._isValid) return message1;
    if (new Date(value) < new Date(minDate)) return message2;
  }
} 
