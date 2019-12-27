import BaseAction from './BaseAction'
/**
 * Files are automatically generated from the template.
 * MQ Solutions 2019
 */
class StaffAction extends BaseAction {
  get actions() {
    return {
      create: {
        method: 'post',
        url: '/api/v1/staffs',
        type: 'Staff.create'
      },
      edit: {
        method: 'put',
        url: '/api/v1/staffs/:_id',
        type: 'Staff.edit'
      },
      destroy: {
        method: 'delete',
        url: '/api/v1/staffs/:_id',
        type: 'Staff.destroy'
      },
      delete: {
        method: 'delete',
        url: '/api/v1/staffs',
        type: 'Staff.delete'
      },
      fetchAll: {
        method: 'get',
        url: '/api/v1/staffs',
        type: 'Staff.fetchAll'
      },
      fetch: {
        method: 'get',
        url: '/api/v1/staffs/:_id',
        type: 'Staff.fetch'
      },
      salary: {
        method: 'get',
        url: '/api/v1/staffs/salary',
        type: 'Staff.salary'
      }
    }
  }
}
/*
 * bắt buộc gọi hàm export()
 */
export default StaffAction.export()