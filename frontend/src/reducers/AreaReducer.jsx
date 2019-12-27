import BaseReducer from './BaseReducer';

class AreaReducer extends BaseReducer {
  get actionsAllow() {
    return {
      ...super.actionsAllow,
      "Area.create": {
        path: "data"
      },
      "Area.edit": {
        path: "data"
      },
      "Area.delete": {
        path: "data"
      },
      "Area.destroy": {
        path: "data"
      },
      "Area.fetchAll": {
        path: "list"
      },
      "Area.fetch": {
        path: "item"
      },
      "Area.forGroupedSelectField": {
        path: "list"
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

export default AreaReducer.export()
