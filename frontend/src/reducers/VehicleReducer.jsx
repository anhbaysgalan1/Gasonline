import BaseReducer from './BaseReducer';

class VehicleReducer extends BaseReducer {
  get actionsAllow() {
    return {
      ...super.actionsAllow,
      "Vehicle.create": {
        path: "data"
      },
      "Vehicle.edit": {
        path: "data"
      },
      "Vehicle.delete": {
        path: "data"
      },
      "Vehicle.destroy": {
        path: "data"
      },
      "Vehicle.fetchAll": {
        path: "list"
      },
      "Vehicle.fetch": {
        path: "item"
      },
      "Vehicle.fetchForDriver": {
        path: "item"
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

/*
 * bắt buộc gọi hàm export()
 */
export default VehicleReducer.export()
