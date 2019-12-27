import BaseAction from './BaseAction'

class AreaAction extends BaseAction {
  get actions() {
    return {
      create: {
        method: 'post',
        url: '/api/areas',
        type: 'Area.create'
      },
      edit: {
        method: 'put',
        url: '/api/areas/:_id',
        type: 'Area.edit'
      },
      destroy: {
        method: 'delete',
        url: '/api/areas/:_id',
        type: 'Area.destroy'
      },
      delete: {
        method: 'post',
        url: '/api/areas/deleteMulti',
        type: 'Area.delete'
      },
      fetchAll: {
        method: 'get',
        url: '/api/areas',
        type: 'Area.fetchAll'
      },
      fetch: {
        method: 'get',
        url: '/api/areas/:_id',
        type: 'Area.fetch'
      },
     
    }
  }
}


export default AreaAction.export()
