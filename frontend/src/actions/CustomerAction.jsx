import BaseAction from './BaseAction'
/**
 * Files are automatically generated from the template.
 * MQ Solutions 2019
 */
class CustomerAction extends BaseAction {
  get actions() {
    return {
      create: {
        method: 'post',
        url: '/api/customers',
        type: 'Customer.create'
      },
      edit: {
        method: 'put',
        url: '/api/customers/:id',
        type: 'Customer.edit'
      },
      destroy: {
        method: 'delete',
        url: '/api/customers/:id',
        type: 'Customer.destroy'
      },
      delete: {
        method: 'post',
        url: '/api/customers/deleteMulti',
        type: 'Customer.delete'
      },
      fetchAll: {
        method: 'get',
        url: '/api/customers',
        type: 'Customer.fetchAll'
      },
      fetch: {
        method: 'get',
        url: '/api/customers/:id',
        type: 'Customer.fetch'
      }
    }
  }

  clearData(data = {}) {
    return (dispath) => dispath({
      data: data,
      type: 'Customer.clearData'
    })
  }
}
/*
 * bắt buộc gọi hàm export()
 */
export default CustomerAction.export()
