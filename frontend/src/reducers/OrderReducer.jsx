import BaseReducer from './BaseReducer';

class OrderReducer extends BaseReducer {
  get actionsAllow() {
    return {
      ...super.actionsAllow,
      "Order.create": {
        path: "data"
      },
      "Order.edit": {
        path: "data"
      },
      "Order.delete": {
        path: "data"
      },
      "Order.destroy": {
        path: "data"
      },
      "Order.fetchAll": {
        path: "list"
      },
      "Order.fetch": {
        path: "item"
      },
      "Order.fetchDaily": {
        path: "listDaily"
      },
      "Order.divide": {
        path: "data"
      },
      "Order.sortDivided": {
        path: "data"
      }
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

export default OrderReducer.export()
