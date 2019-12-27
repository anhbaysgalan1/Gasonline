import BaseAction from './BaseAction'
/**
 * Files are automatically generated from the template.
 * MQ Solutions 2019
 */
class CategoryAction extends BaseAction {
  get actions() {
    return {
      create: {
        method: 'post',
        url: '/api/v1/categories',
        type: 'Category.create'
      },
      edit: {
        method: 'put',
        url: '/api/v1/categories/:_id',
        type: 'Category.edit'
      },
      destroy: {
        method: 'delete',
        url: '/api/v1/categories/:_id',
        type: 'Category.destroy'
      },
      delete: {
        method: 'delete',
        url: '/api/v1/categories',
        type: 'Category.delete'
      },
      fetchAll: {
        method: 'get',
        url: '/api/v1/categories',
        type: 'Category.fetchAll'
      },
      fetch: {
        method: 'get',
        url: '/api/v1/categories/:_id',
        type: 'Category.fetch'
      }
    }
  }
}
/*
 * bắt buộc gọi hàm export()
 */
export default CategoryAction.export()