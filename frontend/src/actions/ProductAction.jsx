import BaseAction from './BaseAction'
/**
 * Files are automatically generated from the template.
 * MQ Solutions 2019
 */
class ProductAction extends BaseAction {
  get actions() {
    return {
      create: {
        method: 'post',
        url: '/api/v1/products',
        type: 'Product.create'
      },
      edit: {
        method: 'put',
        url: '/api/v1/products/:_id',
        type: 'Product.edit'
      },
      destroy: {
        method: 'delete',
        url: '/api/v1/products/:_id',
        type: 'Product.destroy'
      },
      delete: {
        method: 'delete',
        url: '/api/v1/products',
        type: 'Product.delete'
      },
      fetchAll: {
        method: 'get',
        url: '/api/v1/products',
        type: 'Product.fetchAll'
      },
      fetch: {
        method: 'get',
        url: '/api/v1/products/:_id',
        type: 'Product.fetch'
      },
      forGroupedSelectField: {
        method: 'get',
        url: '/api/v1/products/forGroupedSelectField',
        type: 'Product.forGroupedSelectField'
      }
    }
  }
}
/*
 * bắt buộc gọi hàm export()
 */
export default ProductAction.export()