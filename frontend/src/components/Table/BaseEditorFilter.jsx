import React, {Component} from 'react'

class BaseEditorFilter extends Component {
  constructor(props) {
    super(props)
    this.handleChange = this.handleChange.bind(this)
  }

  handleChange(event) {
    const {onValueChange} = this.props
    const newValue = event.target.value;
    if (newValue.trim() === '') {
      onValueChange();
      return;
    }
    onValueChange(targetValue);
  }

  render() {
    const {value} = this.props
    return (
      <Input
        type="text"
        fullWidth
        value={value === undefined ? '' : value}
        inputProps={{}}
        onChange={this.handleChange}
      />)
  }
}
