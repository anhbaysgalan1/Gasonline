import React from 'react';
import Icon from '@material-ui/core/Icon';
import WidgetsIcon from '@material-ui/icons/Widgets';
import ShoppingCartIcon from '@material-ui/icons/ShoppingCart';
import EqualizerIcon from '@material-ui/icons/Equalizer';
import ExploreIcon from '@material-ui/icons/Explore';
import {FontAwesomeIcon} from '@fortawesome/react-fontawesome';
import {faBuilding, faCity, faTruck, faUserFriends, faUserTag, faYenSign} from '@fortawesome/free-solid-svg-icons'
import {I18n} from 'helpers/I18n';
import AreaIndex from 'containers/Area/Index'
import CustomerIndex from 'containers/Customer/Index'
import DivideOrder from 'containers/DivideOrder/Index'
import DriverIndex from 'containers/Driver/Index'
import ReportIndex from 'containers/Report/Index'
import SettingPrice from 'containers/SettingPrice/Index'
import OrderIndex from 'containers/Order/Index'
import VehicleIndex from 'containers/Vehicle/Index'

import Delivery from 'containers/Delivery/Index'
import DeliveryOthers from 'containers/DeliveryOthers/Index'
import RemainingAmount from 'containers/RemainingAmount/Index'

import InvoiceIndex from 'containers/Invoice/Index'
import CustomerOrderIndex from 'containers/CustomersOrder/Index'
import PouredAmount from 'containers/PouredAmount/Index'

const sidebar = {
  admin: [
    {
      path: "/orders",
      name: 'order.index',
      title: I18n.t('Sidebar.order'),
      icon: <ShoppingCartIcon/>,
      component: () => <OrderIndex/>,
    },
    {
      path: "/divide-order",
      name: 'divideOrder.index',
      title: I18n.t('Sidebar.divideOrder'),
      icon: <WidgetsIcon/>,
      component: () => <DivideOrder/>,
    },
    {
      path: "/customers",
      name: 'customer.index',
      title: I18n.t('Sidebar.customer'),
      icon: <FontAwesomeIcon icon={faBuilding} size="lg"/>,
      component: () => <CustomerIndex/>,
    },
    {
      path: "/areas",
      name: 'area.index',
      title: I18n.t('Sidebar.area'),
      icon: <FontAwesomeIcon icon={faCity} size="lg"/>,
      component: () => <AreaIndex/>,
    },
    {
      path: "/drivers",
      name: 'driver.index',
      title: I18n.t('Sidebar.driver'),
      icon: <FontAwesomeIcon icon={faUserTag} size="lg"/>,
      component: () => <DriverIndex/>,
    },
    {
      path: "/vehicles",
      name: 'vehicle.index',
      title: I18n.t('Sidebar.vehicle'),
      icon: <FontAwesomeIcon icon={faTruck} size="lg"/>,
      component: () => <VehicleIndex/>,
    },
    {
      path: "/setting-price",
      name: 'settingPrice.index',
      title: I18n.t('Sidebar.settingPrice'),
      icon: <FontAwesomeIcon icon={faYenSign} size="lg"/>,
      component: () => <SettingPrice/>,
    },
    {
      path: "/report",
      name: 'report.index',
      title: I18n.t('Sidebar.report'),
      icon: <EqualizerIcon/>,
      component: () => <ReportIndex/>,
      //hidden: true
    },
    {
      path: "/invoices",
      name: 'invoice.index',
      title: I18n.t('Sidebar.invoice'),
      icon: <Icon>attach_money</Icon>,
      component: () => <InvoiceIndex/>,
      // hidden: false
    },
    {
      path: "/customer-order",
      name: 'customerOrder.index',
      title: I18n.t('Sidebar.customerOrders'),
      icon: <Icon>list</Icon>,
      component: () => < CustomerOrderIndex/>,
      // hidden: false
    }
  ],
  driver: [
    {
      path: "/delivery",
      name: 'delivery.index',
      title: I18n.t('Sidebar.delivery'),
      icon: <ExploreIcon/>,
      component: () => <Delivery/>,
      // hidden: true
    },
    {
      path: "/delivery-others",
      name: 'deliveryOthers.index',
      title: I18n.t('Sidebar.deliveryOthers'),
      icon: <FontAwesomeIcon icon={faUserFriends} size="lg"/>,
      component: () => <DeliveryOthers/>,
      // hidden: true
    },
    {
      path: "/poured-amount",
      name: 'pouredAmount.index',
      title: I18n.t('Sidebar.pouringFuels'),
      icon: <Icon>local_gas_station</Icon>,
      component: () => <PouredAmount/>,
      // hidden: true
    },
    {
      path: "/remaining-amount",
      name: 'remainingAmount.index',
      title: I18n.t('Sidebar.remainingFuels'),
      icon: <Icon>opacity</Icon>,
      component: () => <RemainingAmount/>,
      // hidden: true
    }
  ]
}
export default sidebar
