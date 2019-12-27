import BaseAction from './BaseAction'
/**
 * Files are automatically generated from the template.
 * MQ Solutions 2019
 */
class HistoryAction extends BaseAction {
  get actions() {
    return {
      create: {
        method: 'post',
        url: '/api/histories',
        type: 'History.create'
      },
      edit: {
        method: 'put',
        url: '/api/histories/:id',
        type: 'History.edit'
      },
      patch: {
        method: 'patch',
        url: '/api/histories/:id',
        type: 'History.patch'
      },
      destroy: {
        method: 'delete',
        url: '/api/histories/:id',
        type: 'History.destroy'
      },
      delete: {
        method: 'post',
        url: '/api/histories/deleteMulti',
        type: 'History.delete'
      },
      fetchAll: {
        method: 'get',
        url: '/api/histories',
        type: 'History.fetchAll'
      },
      fetch: {
        method: 'get',
        url: '/api/histories/:id',
        type: 'History.fetch'
      },
    }
  }
}
/*
 * bắt buộc gọi hàm export()
 */
export default HistoryAction.export()
