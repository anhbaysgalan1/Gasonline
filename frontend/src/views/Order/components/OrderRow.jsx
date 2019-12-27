import React from 'react'
import withStyles from '@material-ui/core/styles/withStyles';
import {TextField} from 'components/Forms'
import AutoCompleteField from 'components/Forms/AutoCompleteField'
import {I18n} from 'helpers/I18n'
import {BaseView} from 'views/BaseView';
import {TableCell, TableRow} from '@material-ui/core';

const styles = theme => ({
  inpInline: {
    width: "30%",
    marginRight: "3px"
  },
  noWrapOption: {
    whiteSpace: 'nowrap'
  }
});

class OrderForm extends BaseView {
  constructor(props) {
    super(props)
    this.defaultProduct = {
      price: 0,
      quantity: 1,
      discount: 0
    }

    this.state = {
      product: this.defaultProduct,
    }
  }

  componentDidUpdate() {
    let price = this.state.product.price || 0
    let {quantity, discount} = this.state.product
    let total = price * quantity

    this.props.onRowChange(this.props.index, {
      total: total,
      discount: discount
    })
  }

  onSelected = (selected) => {
    const {index, incRows} = this.props
    this.setState({
      product: {
        ...this.defaultProduct,
        ...selected,
      }
    })

    if (index === this.props.rows - 1) {
      incRows()
    }
  }

  onChange = (field) => (value) => {
    this.setState({
      product: {
        ...this.state.product,
        [field]: value
      }
    })
  }

  getOptionLabel = (option) => {
    return option.label || option.name
  }

  getOptionValue = (option) => {
    if (!option) return undefined
    if (!option._id) {
      return option.value
    }
    return option._id
  }

  renderTotal() {
    let {quantity, discount, price} = this.state.product
    let total = price * quantity
    if (discount > 0) {
      return <React.Fragment><s>{total}K</s><br/> {total - discount}K</React.Fragment>
    } else {
      return <React.Fragment>{total}K</React.Fragment>
    }
  }

  render() {
    const {products, staffs, index, classes, data} = this.props
    const {product} = this.state
    let selected = data._id ? data : undefined

    return (<TableRow key={index}>
      <TableCell component="th" scope="row">
        <AutoCompleteField
          fullWidth
          name={`products[${index}]['_id']`}
          onChange={this.onSelected}
          getOptionLabel={this.getOptionLabel}
          getOptionValue={this.getOptionValue}
          classes={{}}
          label={I18n.t("Label.chooseProduct")}
          options={products}
          value={selected}
          clearable={false}
        >
        </AutoCompleteField>
        <TextField type="hidden" value={product.name} name={`products[${index}]['name']`}/>
      </TableCell>

      <TableCell align="right">
        <TextField
          className={classes.inpInline}
          name={`products[${index}]['price']`}
          value={product.price}
          variant="outlined"
          label="Đơn giá"
          InputProps={{
            readOnly: true
          }}
        />
        <TextField
          className={classes.inpInline}
          name={`products[${index}]['quantity']`}
          variant="outlined"
          label="Số lượng"
          value={product.quantity}
          onChange={this.onChange("quantity")}
        />
        <TextField
          className={classes.inpInline}
          variant="outlined"
          name={`products[${index}]['discount']`}
          label="Giảm giá"
          value={product.discount}
          onChange={this.onChange("discount")}
        />
      </TableCell>

      <TableCell align="right">
        {this.renderTotal()}
      </TableCell>
    </TableRow>)
  }
}

export default withStyles(styles)(OrderForm);
