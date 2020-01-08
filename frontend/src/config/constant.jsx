import moment from 'moment';
import {I18n} from 'helpers/I18n';

const object = [
  {value: '1', name: 'SKE'},
  {value: '2', name: 'MC Center'}
]

const customerFlags = [
  {value: 'A', text: 'A', label: I18n.t('Label.customer.MCFlags.A')},
  {value: 'B', text: 'B', label: I18n.t('Label.customer.MCFlags.B')},
  {value: 'C', text: 'C', label: I18n.t('Label.customer.MCFlags.C')}
]

const customerTypes = [
  {value: "1", key: 'direct', label: I18n.t("Label.customer.types.direct")},
  {value: "2", key: 'mediate', label: I18n.t("Label.customer.types.mediate")}
]

const customerPaymentTerms = [
  {value: '15', text: '15日'},
  {value: '20', text: '20日'},
  {value: '25', text: '25日'},
  {value: 'end', text: I18n.t("Label.endMonth")},
  {value: '1', text: '1日'},
  {value: '2', text: '2日'},
  {value: '3', text: '3日'},
  {value: '4', text: '4日'},
  {value: '5', text: '5日'},
  {value: '6', text: '6日'},
  {value: '7', text: '7日'},
  {value: '8', text: '8日'},
  {value: '9', text: '9日'},
  {value: '10', text: '10日'},
  {value: '11', text: '11日'},
  {value: '12', text: '12日'},
  {value: '13', text: '13日'},
  {value: '14', text: '14日'},
  {value: '16', text: '16日'},
  {value: '17', text: '17日'},
  {value: '18', text: '18日'},
  {value: '19', text: '19日'},
  {value: '21', text: '21日'},
  {value: '22', text: '22日'},
  {value: '23', text: '23日'},
  {value: '24', text: '24日'},
  {value: '26', text: '26日'},
  {value: '27', text: '27日'},
  {value: '28', text: '28日'},
  {value: '29', text: '29日'},
  {value: '30', text: '30日'},
  {value: '31', text: '31日'}
]

const dataTypes = [
  "date", "number", "text"
]

const dateFormatBackend = "YYYY-MM-DD";
const dateFormatDefault = "YYYY-MM-DD";
const dateTimeFormatDefault = "YYYY-MM-DD HH:mm:ss";
const monthFormatBackend = "YYYY-MM";
const monthFormatDefault = "YYYY/MM";
const formatDateField = 'YYYY/MM/DD';

const deliveryTime = [
  {key: "1", value: "1", label: I18n.t("Common.deliveryTime.morning")},
  {key: "2", value: "2", label: I18n.t("Common.deliveryTime.afternoon")},
  {key: "3", value: "3", label: I18n.t("Common.deliveryTime.anytime")}
]

const fuelProducts = [
  'diesel',
  'kerosene',
  'gasoline',
  'adBlue'
]

const httpStatus = {
  OK: 200,
  CREATED: 201,
  BAD_REQUEST: 400,
  UNAUTHORIZED: 401,
  FORBIDDEN: 403,
  NOT_FOUND: 404,
  METHOD_NOT_ALLOWED: 405,
  UNPROCESSABLE_ENTITY: 422,
  INTERNAL_SERVER_ERROR: 500,
}

const locale = window.config.LANG;

const minDate = moment(new Date("01/01/2000")).format(dateFormatDefault);

const pouredFuelTypes = {
  import: 1,
  export: 2
}

const roles = {
  admin: "admin",
  driver: "driver"
}

const statusOrder = {
  waiting: 1, // đang chờ
  divided: 2, // đã phân chia người giao hàng
  delivered: 3, // đã giao hàng
}


let months = [];
for(let i = 1; i <= 12; i++)
  months.push({ value: i, text: `${i}${I18n.t("Label.month")}`, })

export {
  customerFlags,
  customerTypes,
  customerPaymentTerms,
  dateFormatBackend,
  dateFormatDefault,
  dateTimeFormatDefault,
  deliveryTime,
  formatDateField,
  fuelProducts,
  httpStatus,
  locale,
  minDate,
  monthFormatBackend,
  monthFormatDefault,
  pouredFuelTypes,
  roles,
  statusOrder,
  object,
  months
}
