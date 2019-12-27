import BaseAction from './BaseAction'

class VehicleAction extends BaseAction {
  get actions() {
    return {
      create: {
        method: 'post',
        url: '/api/vehicles',
        type: 'Vehicle.create'
      },
      edit: {
        method: 'put',
        url: '/api/vehicles/:id',
        type: 'Vehicle.edit'
      },
      patch: {
        method: 'patch',
        url: '/api/vehicles/:id',
        type: 'Vehicle.patch'
      },
      destroy: {
        method: 'delete',
        url: '/api/vehicles/:id',
        type: 'Vehicle.destroy'
      },
      delete: {
        method: 'post',
        url: '/api/vehicles/deleteMulti',
        type: 'Vehicle.delete'
      },
      fetchAll: {
        method: 'get',
        url: '/api/vehicles',
        type: 'Vehicle.fetchAll'
      },
      fetch: {
        method: 'get',
        url: '/api/vehicles/:id',
        type: 'Vehicle.fetch'
      },
      fetchForDriver: {
        method: 'get',
        url: '/api/vehicles/auth',
        type: 'Vehicle.fetchForDriver'
      },
    }
  }
}
/*
 * bắt buộc gọi hàm export()
 */

export default VehicleAction.export()
