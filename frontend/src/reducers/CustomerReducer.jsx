import BaseReducer from './BaseReducer';

class CustomerReducer extends BaseReducer {
  get actionsAllow() {
    return {
      ...super.actionsAllow,
      "Customer.create": {
        path: "data"
      },
      "Customer.edit": {
        path: "data"
      },
      "Customer.delete": {
        path: "data"
      },
      "Customer.destroy": {
        path: "data"
      },
      "Customer.fetchAll": {
        path: "list"
      },
      "Customer.fetch": {
        path: "item"
      },
      "Customer.clearData": this.clearData
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

export default CustomerReducer.export()
