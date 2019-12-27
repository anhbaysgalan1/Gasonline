import React from 'react';
import {Chip, Grid, InputAdornment} from "@material-ui/core";
import {TextField} from 'components/Forms';
import {Option} from 'components/Forms/SelectField';
import {deliveryTime, fuelProducts, roles, statusOrder} from 'config/constant';
import {I18n} from 'helpers/I18n';
import _ from 'lodash';
import moment from 'moment';

const utilities = {

  defineDefaultIndex() {
    let path = "/login";
    if (localStorage.getItem('token')) {
      let authUser = JSON.parse(localStorage.getItem('user'));
      path = (authUser.role === roles.admin) ? "/customers" : "/delivery"
    }
    return path
  },

  _formatData(value) {
    return String(value).replace(/\D/g, '')
  },

  _getData(obj, path, defaultValue = undefined) {
    let value = _.get(obj, path, defaultValue);
    return value == null ? defaultValue : value
  },

  _formatDeliveryTime(data) {
    switch (data.value || data) {
      case 1:
        return I18n.t('Common.deliveryTime.morning');
      case 2:
        return I18n.t('Common.deliveryTime.afternoon');
      case 3:
        return I18n.t('Common.deliveryTime.anytime');
      default:
        return I18n.t('Common.deliveryTime.unknown');
    }
  },

  _formatOrderStatus(data) {
    switch (data.value || data) {
      case 1:
        return <Chip size="small" label={I18n.t('Label.statusOrder.waiting')}/>
      case 2:
        return <Chip size="small" color="secondary" label={I18n.t('Label.statusOrder.divided')}/>
      case 3:
        return <Chip size="small" color="primary" label={I18n.t('Label.statusOrder.delivered')}/>
      default:
        return 'N/A';
    }
  },

  filterDividedOrdersByTruck(orders, truck) {
    return orders.filter(order => {
      let orderDriverId = _.get(order, "driver._id", null);
      let vehicleDriverId = _.get(truck, "driver._id", null)
      return orderDriverId && vehicleDriverId && orderDriverId.toString() === vehicleDriverId.toString()
    })
  },

  filerOrderByDate(orders, date) {
    return orders.filter(item => moment(item.deliveryDate).isSame(moment(date), "day"));
  },

  filterUndividedOrders(orders) {
    return orders.filter(item => item.status === statusOrder.waiting);
  },

  formatDataExportFuels(data) {
    let rs = {
      details: []
    };
    for (let fuel in data) {
      if (data[fuel]) {
        if (fuel !== 'receivedVehicle') {
          let value = parseInt(data[fuel]);
          if (value) rs.details.push({material: fuel, quantity: value})
        } else {
          rs[fuel] = data[fuel]
        }
      }
    }
    return rs;
  },

  formatDataImportFuels(data) {
    let arr = [];
    for (let fuel in data) {
      let quantity = data[fuel] ? parseInt(data[fuel]) : 0;
      arr.push({material: fuel, quantity})
    }
    return arr;
  },

  formatDataOrderDetails(data) {
    if (Array.isArray(data)) {
      data.map(item => {
        item.quantity = (item.quantity === undefined) ? 0 : item.quantity
      })
    }
    return data;
  },

  getUnitForStaffValue(type) {
    return type === 0 ? "%" : "K"
  },

  getValueForStaff(productPrice, staffValue, type) {
    return type === 0 ? (productPrice * staffValue / 100) : staffValue;
  },

  //theo số lượng dự kiến
  getSumOfEachFuel(orders) {
    let total = {};
    if (orders.length) {
      orders.forEach(order => {
        let data = this._getData(order, 'orderDetails', []);
        if (data.length) {
          data.map(item => {
            let key = item.name;
            if (total[key]) {
              total[key] += Number(item.quantity)
            } else {
              total[key] = Number(item.quantity)
            }
          })
        }
      })
    } else {
      fuelProducts.map(fuel => {
        total[fuel] = 0
      })
    }
    return total;
  },

  renderDeliveryTimeOptions() {
    return deliveryTime.map(item => <Option value={item.value} key={item.key}>{item.label}</Option>)
  },

  renderFormInputFuels(data = {}, readOnly = false, defaultValue = '') {
    return fuelProducts.map(fuel => this.renderFormInputFuel(fuel, data, readOnly, defaultValue))
  },

  renderFormInputFuel(fuel, data = {}, readOnly = false, defaultValue = '') {
    return (
      <Grid item xs={12} lg={6} key={fuel}>
        <TextField
          fullWidth
          type="text"
          variant='outlined'
          margin='none'
          label={I18n.t(`Label.products.${fuel}`)}
          name={fuel}
          formatData={this.formatData}
          value={this._getData(data, fuel, defaultValue)}
          InputProps={{
            endAdornment: <InputAdornment position="end"> L </InputAdornment>,
            readOnly: readOnly
          }}
        />
      </Grid>
    )
  }
}

export default utilities;
