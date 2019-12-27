import BaseReducer from './BaseReducer';

class DriverReducer extends BaseReducer {
  get actionsAllow() {
    return {
      ...super.actionsAllow,
      "Driver.create": {
        path: "data"
      },
      "Driver.edit": {
        path: "data"
      },
      "Driver.delete": {
        path: "data"
      },
      "Driver.destroy": {
        path: "data"
      },
      "Driver.fetchAll": {
        path: "list"
      },
      "Driver.fetch": {
        path: "item"
      },
      "Driver.forGroupedSelectField": {
        path: "list"
      },
      "Driver.login": {
        path: "data"
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
export default DriverReducer.export()