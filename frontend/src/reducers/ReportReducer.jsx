import BaseReducer from './BaseReducer';

class ReportReducer extends BaseReducer {
  get actionsAllow() {
    return {
      ...super.actionsAllow,
      "Report.invoices": {
        path: "invoices"
      },
      "Report.export_invoices": {
        path: "export_invoices"
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

export default ReportReducer.export()
