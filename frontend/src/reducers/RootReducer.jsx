import {combineReducers} from 'redux';
//import { i18nReducer } from 'helpers/I18n';
import LoadingReducer from './LoadingReducer';
import UtilityReducer from './UtilityReducer';
import AuthReducer from './AuthReducer';
import ReportReducer from './ReportReducer';
import AreaReducer from './AreaReducer';
import CustomerReducer from './CustomerReducer';
import DeliveryReducer from './DeliveryReducer';
import DriverReducer from './DriverReducer';
import HistoryReducer from './HistoryReducer';
import SettingPriceReducer from './SettingPriceReducer';
import OrderReducer from './OrderReducer';
import VehicleReducer from './VehicleReducer';

export default combineReducers({
//  i18n: i18nReducer,
  loading: LoadingReducer,
  utility: UtilityReducer,
  auth: AuthReducer,
  reports: ReportReducer,
  area: AreaReducer,
  customer: CustomerReducer,
  delivery: DeliveryReducer,
  driver: DriverReducer,
  history: HistoryReducer,
  settingPrice: SettingPriceReducer,
  order: OrderReducer,
  vehicle: VehicleReducer,
});
