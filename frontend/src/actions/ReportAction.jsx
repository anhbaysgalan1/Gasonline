import BaseAction from './BaseAction'
/**
 * Files are automatically generated from the template.
 * MQ Solutions 2019
 */
class ReportAction extends BaseAction {
  get actions() {
    return {
      fetchInvoices: {
        method: 'get',
        url: '/api/reports/invoice',
        type: 'Report.invoices'
      },
    }
  }
}
/*
 * bắt buộc gọi hàm export()
 */
export default ReportAction.export()