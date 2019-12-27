import React from 'react'
import withStyles from '@material-ui/core/styles/withStyles';
import {BaseView} from 'views/BaseView';
import {I18n} from 'helpers/I18n';
import {Grid, Table, TableBody, TableCell, TableHead, TableRow, Typography} from '@material-ui/core';
import {TextField} from 'components/Forms'
import PaperFade from "components/Main/PaperFade"

const styles = theme => ({
  tableWrapper: {
    margin: "0px -16px"
  },
  table: {
    //  minWidth: 1200,
    //tableLayout: 'auto'
  },
  tableCellProduct: {
    width: 200
  },
  btnFooter: {
    marginTop: "25px",
    marginLeft: "5px"
  },
  categoryRow: {
    background: "#e6e6e6",
    padding: "5px !important",
    fontWeight: "bold",
  },
  colName: {
    width: "30%"
  },
  col: {
    fontSize: "11px"
  },
  categoryRowFooter: {
    background: "#c5ecc9",
    padding: "10px",
    textAlign: "right",
    fontSize: "11px"
  },
  categoryRowFooterAll: {
    background: "#8dbd92",
    padding: "10px",
    textAlign: "right",
    fontSize: "11px"
  },
});

class OrderForm extends BaseView {
  constructor(props) {
    super(props)
    this.state = {
      categories: [],
      products: [],
      orders: {}
    }
    this.products = []
    this.productByIds = {}
  }

  componentDidUpdate(prevProps) {
    let nextProducts = this.getData(this.props, "products", [])
    let prevProducts = this.products
    if (nextProducts.length > 0 && nextProducts.length !== prevProducts.length) {
      this.products = nextProducts

      let orders = nextProducts.reduce((products, product) => {
        this.productByIds[product._id] = product
        products = {
          ...products,
          [product._id]: {
            quantity: 0,
            total: 0
          }
        }
        return products
      }, {})
      this.setState({
        orders: orders
      })
    }
  }

  formatNumber(x) {
    return x.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",");
  }

  getOrder() {
    let categories = {}
    for (let productId in this.state.orders) {
      let product = this.productByIds[productId]
      if (!categories[product.categoryId]) {
        categories[product.categoryId] = []
      }
      categories[product.categoryId].push({
        ...product,
        ...this.state.orders[productId]
      })
    }
    return categories
  }

  getQuantityInOrder(productId) {
    return this.getData(this.state.orders, `${productId}.quantity`, 0)
  }

  getProductById(productId) {
    return this.props.products.filter(product => product._id === productId)[0]
  }

  getDiscountInfo(product, category, discountCategory) {
    if (discountCategory.value) {
      return {
        value: discountCategory.value,
        percent: discountCategory.percent,
        price: Math.round(product.price * (100 - discountCategory.percent) / 100)
      }
    }
    let discountType = category.discountType
    let quantity = this.getData(this.state.orders, `${product._id}.quantity`, 0)
    let discountInfo = {
      value: 0,
      percent: 0,
      price: product.price
    }
    //discount theo số lượng
    if (discountType === 2) {
      for (let discount of product.discount) {
        if (discount.value <= quantity) {
          discountInfo = discount
          //break;
        }
      }
    }
    return discountInfo
  }

  getDiscountInfoByCategory(category) {
    //tính tổng tiền các sản phẩm của category
    let total = Object.values(this.state.orders).reduce((total, product) => {
      if (product.categoryId === category._id) {
        total += (product.total || 0)
      }
      return total;
    }, 0)
    let discountInfo = {}
    //trường hợp discountType == 2 => discount theo số lương, bỏ qua.
    if (category.discountType === 1) {
      //tìm discount thỏa mãn điều kiện tổng của category
      for (let discount of category.discount) {
        if (total * (100 - Number(discount.percent)) / 100 > discount.value) {
          discountInfo = discount
          //break;
        }
      }
    }
    return discountInfo
  }

  onQuantityChange(productId, quantity) {
    //let product = this.getProductById(productId)
    this.setState({
      orders: {
        ...this.state.orders,
        [productId]: {
          quantity: quantity,
        }
      }
    })
  }

  renderTotal(total, totalNoDiscount, discountCategory, category) {
    const {classes} = this.props
    let title = "Tổng:"
    let value = this.formatNumber(total * 1000)
    if (discountCategory.value) {
      title = <div>
        Tổng:<br/>
        Chiết khấu: <br/>
        Thành Tiền:
      </div>
      let discount = totalNoDiscount - total
      value = <div>
        {this.formatNumber(totalNoDiscount * 1000)}<br/>
        ({discountCategory.percent}%) {this.formatNumber(discount * 1000)}<br/>
        {this.formatNumber(total * 1000)}
      </div>
    }
    return (<TableRow key={`footer${category._id}`}>
      <TableCell colSpan={4} className={classes.categoryRowFooter}>{title}</TableCell>
      <TableCell colSpan={2} className={classes.categoryRowFooter}>{value}</TableCell>
    </TableRow>)
  }

  renderTotalAll(totalAll) {
    const {classes} = this.props
    return (<TableRow key={`footerAll`}>
      <TableCell colSpan={4} className={classes.categoryRowFooterAll}>Tổng đơn hàng</TableCell>
      <TableCell colSpan={2} className={classes.categoryRowFooterAll}>{this.formatNumber(totalAll * 1000)}</TableCell>
    </TableRow>)
  }

  renderProducts() {
    const {classes, categories} = this.props
    const products = this.getOrder()
    let result = []
    let totalAll = 0;
    for (let category of categories) {
      let productInCategory = products[category._id]
      if (!productInCategory) continue;
      //productInCategory = productInCategory
      let discountCategory = this.getDiscountInfoByCategory(category)
      let total = 0;
      let totalNoDiscount = 0
      result.push(<TableRow key={category._id}>
        <TableCell colSpan={10} className={classes.categoryRow}>{category.name}</TableCell>
      </TableRow>)
      for (let product of productInCategory) {
        let discountInfo = this.getDiscountInfo(product, category, discountCategory)
        let productAmount = this.getQuantityInOrder(product._id) * discountInfo.price
        total += productAmount
        totalNoDiscount += this.getQuantityInOrder(product._id) * product.price
        result.push(<TableRow key={product._id}>
          <TableCell className={classes.col}>{product.name}</TableCell>
          <TableCell className={classes.col}>
            <TextField
              type="number"
              name={`quantity[${product._id}]`}
              onChange={value => this.onQuantityChange(product._id, value)}
              value={this.state.orders[product._id].quantity}
              placeholder="0"
              inputProps={{
                pattern: "[0-9]*",
                putmode: "numberic",
                className: classes.inputQuantity
              }}
            />
          </TableCell>
          <TableCell className={classes.col} align="right">{this.formatNumber(product.price * 1000)}</TableCell>
          <TableCell className={classes.col} align="right">{discountInfo.percent}%</TableCell>
          <TableCell className={classes.col} align="right">{this.formatNumber(discountInfo.price * 1000)}</TableCell>
          <TableCell className={classes.col} align="right">{this.formatNumber(productAmount * 1000)}</TableCell>
        </TableRow>)
      }
      result.push(this.renderTotal(total, totalNoDiscount, discountCategory, category))
      totalAll += total
    }
    result.push(this.renderTotalAll(totalAll))
    return result
  }

  render() {
    const {classes} = this.props
    return (<PaperFade>
      <Typography variant="h6">{I18n.t("Label.orderDetail")}</Typography>
      <Grid container spacing={4}>
        <Grid item xs={12}>
          <div className={classes.tableWrapper}>
            <Table
              className={classes.table}
              padding="checkbox"
            >
              <TableHead>
                <TableRow>
                  <TableCell className={classes.colName}>Sản phẩm</TableCell>
                  <TableCell>SL</TableCell>
                  <TableCell>Giá Lẻ</TableCell>
                  <TableCell>CK</TableCell>
                  <TableCell>Giá CK</TableCell>
                  <TableCell>Thành Tiền</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {this.renderProducts()}
              </TableBody>
            </Table>
          </div>
        </Grid>
      </Grid>
    </PaperFade>)
  }
}

export default withStyles(styles)(OrderForm);
