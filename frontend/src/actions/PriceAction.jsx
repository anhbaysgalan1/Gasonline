import BaseAction from './BaseAction'

class PriceAction extends BaseAction {
  get actions() {
    return {
      create: {
        method: 'post',
        url: '/price',
        type: 'Price.create'
      },
      edit: {
        method: 'put',
        url: '/price/:_id',
        type: 'Price.edit'
      },
      destroy: {
        method: 'delete',
        url: '/price/:_id',
        type: 'Price.destroy'
      },
      delete: {
        method: 'delete',
        url: '/price',
        type: 'Price.delete'
      },
      fetchAll: {
        method: 'get',
        url: '/price',
        type: 'Price.fetchAll'
      },
      fetch: {
        method: 'get',
        url: '/price/:_id',
        type: 'Price.fetch'
      }
    }
  }
}

export default PriceAction.export()