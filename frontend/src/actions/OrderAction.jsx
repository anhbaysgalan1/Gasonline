import BaseAction from './BaseAction'

class OrderAction extends BaseAction {
  get actions() {
    return {
      create: {
        method: 'post',
        url: '/api/orders',
        type: 'Order.create'
      },
      edit: {
        method: 'put',
        url: '/api/orders/:id',
        type: 'Order.edit'
      },
      patch: {
        method: 'patch',
        url: '/api/orders/:id',
        type: 'Order.patch'
      },
      destroy: {
        method: 'delete',
        url: '/api/orders/:id',
        type: 'Order.destroy'
      },
      delete: {
        method: 'post',
        url: '/api/orders/deleteMulti',
        type: 'Order.delete'
      },
      fetchAll: {
        method: 'get',
        url: '/api/orders',
        type: 'Order.fetchAll'
      },
      fetch: {
        method: 'get',
        url: '/api/orders/:id',
        type: 'Order.fetch'
      },
      fetchDaily: {
        method: 'get',
        url: '/api/orders/daily',
        type: 'Order.fetchDaily'
      },
      divide: {
        method: 'post',
        url: '/api/orders/divide',
        type: 'Order.divide'
      },
      sortDivided: {
        method: 'post',
        url: '/api/orders/sortDivided',
        type: 'Order.sortDivided'
      }
    }
  }
}

export default OrderAction.export()
