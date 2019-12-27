import BaseAction from './BaseAction'

class SettingPriceAction extends BaseAction {
  get actions() {
    return {
      edit: {
        method: 'post',
        url: '/api/setting-price',
        type: 'SettingPrice.edit'
      },
      fetch: {
        method: 'get',
        url: '/api/setting-price',
        type: 'SettingPrice.fetch'
      }
    }
  }
}

export default SettingPriceAction.export()
