import BaseAction from './BaseAction'
/**
 * Files are automatically generated from the template.
 * MQ Solutions 2019
 */
class GroupAction extends BaseAction {
  get actions() {
    return {
      create: {
        method: 'post',
        url: '/api/v1/groups',
        type: 'Group.create'
      },
      edit: {
        method: 'put',
        url: '/api/v1/groups/:_id',
        type: 'Group.edit'
      },
      destroy: {
        method: 'delete',
        url: '/api/v1/groups/:_id',
        type: 'Group.destroy'
      },
      delete: {
        method: 'delete',
        url: '/api/v1/groups',
        type: 'Group.delete'
      },
      fetchAll: {
        method: 'get',
        url: '/api/v1/groups',
        type: 'Group.fetchAll'
      },
      fetch: {
        method: 'get',
        url: '/api/v1/groups/:_id',
        type: 'Group.fetch'
      }
    }
  }
}
/*
 * bắt buộc gọi hàm export()
 */
export default GroupAction.export()