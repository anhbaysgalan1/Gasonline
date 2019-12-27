import React from 'react';
import View from 'views/Product/Edit'
import ProductAction from '../../actions/ProductAction';
import CategoryAction from 'actions/CategoryAction'
import GroupAction from 'actions/GroupAction'
import BaseContainer, { selector } from 'containers/BaseContainer';
import { withRouter } from 'react-router-dom'
import { connect } from 'react-redux'
import { I18n } from 'helpers/I18n';
/**
 * Files are automatically generated from the template.
 * MQ Solutions 2019
 */
class Edit extends BaseContainer {
  constructor(props) {
    super(props)
    this.onSubmit = this.onSubmit.bind(this)
  }

  componentDidMount() {
    this.id = this.props.match.params.id
    this.props.dispatch(ProductAction.fetch({ _id: this.id }))
    this.props.dispatch(CategoryAction.fetchAll({pageSize: -1}))
    this.props.dispatch(GroupAction.fetchAll({
      pageSize: -1,
      sorting: [{"columnName":"level","direction":"asc"}]
    }))
  }

  onSubmit(values) {
    values.discount = values.discount.filter(discount => discount.value > 0)
    this.props.dispatch(ProductAction.edit({
      _id: this.id,
      ...values
    }))
    .then(data =>{
      if(!data.error){
        this.notify(I18n.t('Message.success.update'))
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
        {...this.props}
        onSubmit={this.onSubmit}
      />
    );
  }
}

const mapStateToProps = state => {
  return {
    //sử dụng selector để lấy state từ redux
    data: selector(state, "product.item", {}),
    categories: selector(state, "category.list.data", []),
    groups: selector(state, "group.list.data", [])
  }
}

export default withRouter(connect(mapStateToProps)(Edit))
