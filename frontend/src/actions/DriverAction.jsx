import BaseAction from './BaseAction'

class DriverAction extends BaseAction {
  get actions() {
    return {
      create: {
        method: 'post',
        url: '/api/drivers',
        type: 'Driver.create'
      },
      edit: {
        method: 'put',
        url: '/api/drivers/:id',
        type: 'Driver.edit'
      },
      destroy: {
        method: 'delete',
        url: '/api/drivers/:id',
        type: 'Driver.destroy'
      },
      delete: {
        method: 'post',
        url: '/api/drivers/deleteMulti',
        type: 'Driver.delete'
      },
      fetchAll: {
        method: 'get',
        url: '/api/drivers',
        type: 'Driver.fetchAll'
      },
      fetch: {
        method: 'get',
        url: '/api/drivers/:id',
        type: 'Driver.fetch'
      }
    }
  }
}

export default DriverAction.export()
