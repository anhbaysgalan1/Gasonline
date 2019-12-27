import BaseReducer from './BaseReducer';

class DeliveryReducer extends BaseReducer {
  get actionsAllow() {
    return {
      ...super.actionsAllow,
      "Delivery.fetchForMe": {
        path: "list"
      },
      "Delivery.fetchForOthers": {
        path: "listOther"
      },
    }
  }

  get initialState() {
    return {
      ...super.initialState,
      error: {
        message: null
      }
    }
  }
}

export default DeliveryReducer.export()
