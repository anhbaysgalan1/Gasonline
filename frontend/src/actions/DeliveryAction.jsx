import BaseAction from './BaseAction'
/**
 * Files are automatically generated from the template.
 * MQ Solutions 2019
 */
class DeliveryAction extends BaseAction {
  get actions() {
    return {
      fetchForMe: {
        method: 'get',
        url: '/api/deliveries/me',
        type: 'Delivery.fetchForMe'
      },
      fetchForOthers: {
        method: 'get',
        url: '/api/deliveries/others',
        type: 'Delivery.fetchForOthers'
      }
    }
  }
}
/*
 * bắt buộc gọi hàm export()
 */
export default DeliveryAction.export()
