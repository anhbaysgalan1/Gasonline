import BaseAction from './BaseAction'

class UserAction extends BaseAction {
  get actions() {
    return {
      create: {
        method: 'post',
        url: '/api/users',
        type: 'User.create'
      },
      edit: {
        method: 'put',
        url: '/api/users/:_id',
        type: 'User.edit'
      },
      destroy: {
        method: 'delete',
        url: '/api/users/:_id',
        type: 'User.destroy'
      },
      delete: {
        method: 'post',
        url: '/api/users/deleteMulti',
        type: 'User.delete'
      },
      fetchAll: {
        method: 'get',
        url: '/api/users',
        type: 'User.fetchAll'
      },
      fetch: {
        method: 'get',
        url: '/api/users/:_id',
        type: 'User.fetch'
      },
      // getTree: {
      //   method: 'get',
      //   url: '/api/users/:_id/tree',
      //   type: 'User.gettree'
      // }
    }
  }
}
/**
 * bắt buộc gọi hàm export()
 */
export default UserAction.export()
