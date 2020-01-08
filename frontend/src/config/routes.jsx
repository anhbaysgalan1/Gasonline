import React, {lazy} from 'react';
import {Redirect} from 'react-router';
import {I18n} from 'helpers/I18n';
import Utils from 'helpers/utility';

let defaultIndex = Utils.defineDefaultIndex();

const AreaIndex = lazy(() => import('containers/Area/Index'))
const AreaCreate = lazy(() => import('containers/Area/Create'))
const AreaEdit = lazy(() => import('containers/Area/Edit'))

const CustomerIndex = lazy(() => import('containers/Customer/Index'))
const CustomerCreate = lazy(() => import('containers/Customer/Create'))
const CustomerEdit = lazy(() => import('containers/Customer/Edit'))
const CustomerDetail = lazy(() => import('containers/Customer/Detail'))

const DriverIndex = lazy(() => import('containers/Driver/Index'))
const DriverEdit = lazy(() => import('containers/Driver/Edit'))
const DriverCreate = lazy(() => import('containers/Driver/Create'))
const DriverDetail = lazy(() => import('containers/Driver/Detail'))

const OrderIndex = lazy(() => import('containers/Order/Index'))
const OrderCreate = lazy(() => import('containers/Order/Create'))
const OrderEdit = lazy(() => import('containers/Order/Edit'))
const OrderDetail = lazy(() => import('containers/Order/Detail'))

const VehicleIndex = lazy(() => import('containers/Vehicle/Index'))
const VehicleEdit = lazy(() => import('containers/Vehicle/Edit'))
const VehicleCreate = lazy(() => import('containers/Vehicle/Create'))
const VehicleDetail = lazy(() => import('containers/Vehicle/Detail'))

const DivideOrder = lazy(() => import('containers/DivideOrder/Index'))

const SettingPrice = lazy(() => import('containers/SettingPrice/Index'))

const ReportIndex = lazy(() => import('containers/Report/Index'))
const ReportDailyPDF = lazy(() => import('containers/Report/ShowPdf'))

const Delivery = lazy(() => import('containers/Delivery/Index'))
const HistoryDelivery = lazy(() => import('containers/Delivery/History'))
const GeneralDelivery = lazy(() => import('containers/Delivery/GeneralDelivery'))
const SeparateDelivery = lazy(() => import('containers/Delivery/SeparateDelivery'))

const DeliveryOthers = lazy(() => import('containers/DeliveryOthers/Index'))
const PouredAmount = lazy(() => import('containers/PouredAmount/Index'))
const RemainingAmount = lazy(() => import('containers/RemainingAmount/Index'))

const InvoiceIndex = lazy(() => import('containers/Invoice/Index'))
const CustomerOrderIndex = lazy(() => import('containers/CustomersOrder/Index'))

const routes = [
  {
    path: "/",
    component: () => <Redirect to={defaultIndex}/>,
    exact: true,
    name: 'dashboard'
  },
  // ======================================== Area Route ================================================
  {
    path: '/areas',
    name: 'area.index',
    title: () => I18n.t('Breadcrumb.area.index'),
    component: () => <AreaIndex/>,
    exact: true,
    sidebarName: 'area.index'
  },
  {
    path: '/areas/create',
    name: 'area.create',
    title: () => I18n.t('Breadcrumb.area.create'),
    component: () => <AreaCreate/>,
    exact: true,
    sidebarName: 'area.index'
  },
  {
    path: '/areas/edit/:id',
    name: 'area.edit',
    title: () => I18n.t('Breadcrumb.area.edit'),
    component: () => <AreaEdit/>,
    exact: true,
    sidebarName: 'area.index'
  },
  //-----------------------------------------------------------------------------------------------------
  //Customer
  {
    path: "/customers",
    name: 'customer.index',
    title: () => I18n.t("Breadcrumb.customer.index"),
    component: () => <CustomerIndex/>,
    exact: true,
    sidebarName: 'customer.index'
  },
  {
    path: "/customers/create",
    name: 'customer.create',
    title: () => I18n.t("Breadcrumb.customer.create"),
    component: () => <CustomerCreate/>,
    exact: true,
    sidebarName: 'customer.index'
  },
  {
    path: "/customers/edit/:id",
    name: 'customer.edit',
    title: () => I18n.t("Breadcrumb.customer.edit"),
    component: () => <CustomerEdit/>,
    exact: true,
    sidebarName: 'customer.index'
  },
  {
    path: "/customers/detail/:id",
    name: 'customer.detail',
    title: () => I18n.t("Breadcrumb.customer.detail"),
    component: () => <CustomerDetail/>,
    exact: true,
    sidebarName: 'customer.index'
  },
  //Truck
  {
    path: "/vehicles",
    name: 'vehicle.index',
    title: () => I18n.t("Breadcrumb.vehicle.index"),
    component: () => <VehicleIndex/>,
    exact: true,
    sidebarName: 'vehicle.index'
  },
  {
    path: "/vehicles/create",
    name: 'vehicle.create',
    title: () => I18n.t("Breadcrumb.vehicle.create"),
    component: () => <VehicleCreate/>,
    exact: true,
    sidebarName: 'vehicle.index'
  },
  {
    path: "/vehicles/edit/:id",
    name: 'vehicle.edit',
    title: () => I18n.t("Breadcrumb.vehicle.edit"),
    component: () => <VehicleEdit/>,
    exact: true,
    sidebarName: 'vehicle.index'
  },
  {
    path: "/vehicles/detail/:id",
    name: 'vehicle.detail',
    title: () => I18n.t("Breadcrumb.vehicle.detail"),
    component: () => <VehicleDetail/>,
    exact: true,
    sidebarName: 'vehicle.index'
  },
  // Driver
  {
    path: "/drivers",
    name: 'driver.index',
    title: () => I18n.t("Breadcrumb.driver.index"),
    component: () => <DriverIndex/>,
    exact: true,
    sidebarName: 'driver.index'
  },
  {
    path: "/drivers/create",
    name: 'driver.create',
    title: () => I18n.t("Breadcrumb.driver.create"),
    component: () => <DriverCreate/>,
    exact: true,
    sidebarName: 'driver.index'
  },
  {
    path: "/drivers/edit/:id",
    name: 'driver.edit',
    title: () => I18n.t("Breadcrumb.driver.edit"),
    component: () => <DriverEdit/>,
    exact: true,
    sidebarName: 'driver.index'
  },
  {
    path: "/drivers/detail/:id",
    name: 'driver.detail',
    title: () => I18n.t("Breadcrumb.driver.detail"),
    component: () => <DriverDetail/>,
    exact: true,
    sidebarName: 'driver.index'
  },
  //Order
  {
    path: "/orders",
    name: 'order.index',
    title: () => I18n.t("Breadcrumb.order.index"),
    component: () => <OrderIndex/>,
    exact: true,
    sidebarName: 'order.index'
  },
  {
    path: "/orders/create",
    name: 'order.create',
    title: () => I18n.t("Breadcrumb.order.create"),
    component: () => <OrderCreate/>,
    exact: true,
    sidebarName: 'order.index'
  },
  {
    path: "/orders/edit/:id",
    name: 'order.edit',
    title: () => I18n.t("Breadcrumb.order.edit"),
    component: () => <OrderEdit/>,
    exact: true,
    sidebarName: 'order.index'
  },
  {
    path: "/orders/detail/:id",
    name: 'order.detail',
    title: () => I18n.t("Breadcrumb.order.detail"),
    component: () => <OrderDetail/>,
    exact: true,
    sidebarName: 'order.index'
  },
  //Divide Order
  {
    path: "/divide-order",
    name: 'divideOrder.index',
    title: () => I18n.t("Breadcrumb.order.divide"),
    component: () => <DivideOrder/>,
    exact: true,
    sidebarName: 'divideOrder.index'
  },
  //Setting Price
  {
    path: "/setting-price",
    name: 'settingPrice.index',
    title: () => I18n.t("Breadcrumb.settingPriceIndex"),
    component: () => <SettingPrice/>,
    exact: true,
    sidebarName: 'settingPrice.index'
  },
  //Report
  {
    path: "/report",
    name: 'report.index',
    title: () => I18n.t("Breadcrumb.reportIndex"),
    component: () => <ReportIndex/>,
    exact: true,
    sidebarName: 'report.index'
  },
  {
    path: "/report/daily/:date",
    name: 'report.showPdf',
    title: () => I18n.t("Button.exportPDF"),
    component: () => <ReportDailyPDF/>,
    exact: true,
    sidebarName: 'report.index'
  },
  //Delivery
  {
    path: "/delivery",
    name: 'delivery.index',
    title: () => I18n.t("Breadcrumb.delivery"),
    component: () => <Delivery/>,
    exact: true,
    sidebarName: 'delivery.index'
  },
  {
    path: "/delivery/:id",
    name: 'delivery.history',
    title: () => I18n.t("Breadcrumb.indexDelivery"),
    component: () => <HistoryDelivery/>,
    exact: true,
    sidebarName: 'delivery.index'
  },
  {
    path: "/delivery/:id/general",
    name: 'delivery.general',
    title: () => I18n.t("Breadcrumb.generalDelivery"),
    component: () => <GeneralDelivery/>,
    exact: true,
    sidebarName: 'delivery.index'
  },
  {
    path: "/delivery/:id/separate",
    name: 'delivery.separate',
    title: () => I18n.t("Breadcrumb.separateDelivery"),
    component: () => <SeparateDelivery/>,
    exact: true,
    sidebarName: 'delivery.index'
  },
  //Delivery Others
  {
    path: "/delivery-others",
    name: 'deliveryOthers.index',
    title: () => I18n.t("Breadcrumb.deliveryOthers"),
    component: () => <DeliveryOthers/>,
    exact: true,
    sidebarName: 'deliveryOthers.index'
  },
  // Poured Fuels in Truck
  {
    path: "/poured-amount",
    name: 'pouredAmount.index',
    title: () => I18n.t("Breadcrumb.pouredAmount"),
    component: () => <PouredAmount/>,
    exact: true,
    sidebarName: 'pouredAmount.index'
  },
  // Remaining Fuels in Truck
  {
    path: "/remaining-amount",
    name: 'remainingAmount.index',
    title: () => I18n.t("Breadcrumb.remainingAmount"),
    component: () => <RemainingAmount/>,
    exact: true,
    sidebarName: 'remainingAmount.index'
  },
  // Invoice
  {
    path: "/invoices",
    name: 'invoice.index',
    title: () => I18n.t("Breadcrumb.invoice"),
    component: () => <InvoiceIndex/>,
    exact: true,
    sidebarName: 'invoice.index'
  },
  // Thống kê đơn hàng theo khách hàng
  {
    path: "/customer-order",
    name: 'customerOrder.index',
    title: () => I18n.t("Breadcrumb.customerOrders"),
    component: () => <CustomerOrderIndex/>,
    exact: true,
    sidebarName: 'customerOrder.index'
  },
]

export default routes
