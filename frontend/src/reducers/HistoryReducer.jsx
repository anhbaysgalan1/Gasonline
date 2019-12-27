import BaseReducer from './BaseReducer';

class HistoryReducer extends BaseReducer {
  get actionsAllow() {
    return {
      ...super.actionsAllow,
      "History.create": {
        path: "data"
      },
      "History.edit": {
        path: "data"
      },
      "History.delete": {
        path: "data"
      },
      "History.destroy": {
        path: "data"
      },
      "History.fetchAll": {
        path: "list"
      },
      "History.fetch": {
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

export default HistoryReducer.export()
