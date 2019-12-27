import React from 'react';
import View from 'views/Product/Create'
import ProductAction from '../../actions/ProductAction';
import BaseContainer, { selector } from 'containers/BaseContainer';
import { withRouter } from 'react-router-dom'
import { connect } from 'react-redux'
import { I18n } from 'helpers/I18n';
import CategoryAction from 'actions/CategoryAction'
import GroupAction from 'actions/GroupAction'
/**
 * Files are automatically generated from the template.
 * MQ Solutions 2019
 */
class Create extends BaseContainer {
  constructor(props) {
    super(props)
    this.onSubmit = this.onSubmit.bind(this)
  }
  componentDidMount() {
    this.props.dispatch(CategoryAction.fetchAll({pageSize: -1}))
    this.props.dispatch(GroupAction.fetchAll({
      pageSize: -1,
      sorting: [{"columnName":"level","direction":"asc"}]
    }))
  }

  onSubmit(values) {
    values.discount = values.discount.filter(discount => discount.value > 0)
    this.props.dispatch(ProductAction.create(values))
    .then(data =>{
      if(!data.error){
        this.notify(I18n.t('Message.success.create'))
        this.goto("/products")
      }
      else{
        this.notify(`Response: [${data.error.status}] ${data.error.message}`, 'error')
      }
    })
  }
  render() {
    return (
      <View
        onSubmit={this.onSubmit}
        {...this.props}
      />
    );
  }
}

const mapStateToProps = state => {
  return {
    //sử dụng selector để lấy state từ redux
    data: selector(state, "product.data", {}),
    categories: selector(state, "category.list.data", []),
    groups: selector(state, "group.list.data", [])
  }
}

export default withRouter(connect(mapStateToProps)(Create))
