'use strict';

let router = require('express').Router();

const ctrlAuth = require('../app/Controllers/AuthController');
// const ctrlProfile = require('../app/Controllers/ProfileController');
const ctrlSettings = require('../app/Controllers/SettingController');
const ctrlArea = require('../app/Controllers/AreaController');
const ctrlCustomer = require('../app/Controllers/CustomerController');
const ctrlDriver = require('../app/Controllers/DriverController');
const ctrlUser = require('../app/Controllers/UserController');
const ctrlOrder = require('../app/Controllers/OrderController');
const ctrlVehicle = require('../app/Controllers/VehicleController');
const ctrlDivideOrder = require('../app/Controllers/DivideOrderController');
const ctrlDelivery = require('../app/Controllers/DeliveryController');
const ctrlHistory = require('../app/Controllers/HistoryController');
const ctrlReport = require('../app/Controllers/ReportController');

const ctrlTest = require('../app/Controllers/TestController');
//header validation
const header_validation = require('./routes_header_validation');
router.use(header_validation);

/**
 * Application routes
 */

// add file in media folder
// const multer = require('multer');
// const config = require('../config');
// const upload = multer({dest: config.uploadDir});
// router.post('/api/upload', upload.fields([{name: 'assets', maxCount: 10}]), ctrlUpload.upload);

router.get('/api/settings', ctrlSettings.getSettings)
router.post('/api/settings', ctrlSettings.update)
router.get('/api/setting-price', ctrlSettings.getSettingPrice)
router.post('/api/setting-price', ctrlSettings.updatePrice)

router.post('/api/register', ctrlAuth.register)
router.post('/api/login', ctrlAuth.login)
router.get('/api/authWithSession', ctrlAuth.authWithSession)
router.post('/api/changePassword', ctrlAuth.changePassword)

// router.get('/api/profile', ctrlProfile.load)

// Routes users
router.get('/api/users', ctrlUser.index)
router.get('/api/users/:userId', ctrlUser.detail)
router.post('/api/users', ctrlUser.store)
router.put('/api/users/:userId', ctrlUser.update)
router.delete('/api/users/:userId', ctrlUser.destroy)
router.param('userId', ctrlUser.load)
router.post('/api/users/deleteMulti', ctrlUser.deleteMulti);

// Route areas
router.get('/api/areas', ctrlArea.index);
router.get('/api/areas/:areaId', ctrlArea.detail);
router.post('/api/areas', ctrlArea.store);
router.put('/api/areas/:areaId', ctrlArea.update);
router.delete('/api/areas/:areaId', ctrlArea.destroy);
router.param('areaId', ctrlArea.load);
router.post('/api/areas/deleteMulti', ctrlArea.deleteMulti);

// Route customers
router.get('/api/customers', ctrlCustomer.index);
router.get('/api/customers/:customerId', ctrlCustomer.detail);
router.post('/api/customers', ctrlCustomer.store);
router.put('/api/customers/:customerId', ctrlCustomer.update);
router.delete('/api/customers/:customerId', ctrlCustomer.destroy);
router.param('customerId', ctrlCustomer.load);
router.post('/api/customers/deleteMulti', ctrlCustomer.deleteMulti);

// Routes drivers
router.get('/api/drivers', ctrlDriver.index)
router.get('/api/drivers/:driverId', ctrlDriver.detail)
router.post('/api/drivers', ctrlDriver.store)
router.put('/api/drivers/:driverId', ctrlDriver.update)
router.delete('/api/drivers/:driverId', ctrlDriver.destroy)
router.param('driverId', ctrlDriver.load)
router.post('/api/drivers/deleteMulti', ctrlDriver.deleteMulti);

// Route Vehicles
router.get('/api/vehicles', ctrlVehicle.index)
router.get('/api/vehicles/auth', ctrlVehicle.getByDriver)
router.get('/api/vehicles/:vehicleId', ctrlVehicle.detail)
router.post('/api/vehicles', ctrlVehicle.store)
router.put('/api/vehicles/:vehicleId', ctrlVehicle.update)
router.delete('/api/vehicles/:vehicleId', ctrlVehicle.destroy)
router.param('vehicleId', ctrlVehicle.load)
router.post('/api/vehicles/deleteMulti', ctrlVehicle.deleteMulti);

// Routes divide-orders
router.get('/api/orders/daily', ctrlDivideOrder.index);
router.get('/api/orders/fakeDivided', ctrlDivideOrder.fakeData);
router.post('/api/orders/divide', ctrlDivideOrder.store);
router.post('/api/orders/sortDivided', ctrlDivideOrder.update);

// Routes orders
router.get('/api/orders/faker', ctrlOrder.fakeData);
router.get('/api/orders', ctrlOrder.index);
router.get('/api/orders/:orderId', ctrlOrder.detail);
router.post('/api/orders', ctrlOrder.store);
router.put('/api/orders/:orderId', ctrlOrder.update);
router.delete('/api/orders/:orderId', ctrlOrder.destroy);
router.param('orderId', ctrlOrder.load);
router.post('/api/orders/deleteMulti', ctrlOrder.deleteMulti);

// routes test
router.get('/api/test', ctrlTest.index);
router.get('/api/test/:itemId', ctrlTest.detail);
router.post('/api/test', ctrlTest.store);
router.put('/api/test/:itemId', ctrlTest.update);
router.delete('/api/test/:itemId', ctrlTest.destroy);
router.param('itemId', ctrlTest.load);
router.post('/api/test/deleteMulti', ctrlTest.deleteMulti);

// Routes for APP
// Routes deliveries
router.get('/api/deliveries/me', ctrlDelivery.getForMe)
router.get('/api/deliveries/others', ctrlDelivery.getForOthers)

// routes histories: import/export fuels
router.get('/api/histories/faker', ctrlHistory.fakeData);
router.get('/api/histories', ctrlHistory.index);
router.get('/api/histories/:historyId', ctrlHistory.detail);
router.post('/api/histories', ctrlHistory.store);
router.put('/api/histories/:historyId', ctrlHistory.update);
router.delete('/api/histories/:historyId', ctrlHistory.destroy);
router.param('historyId', ctrlHistory.load);
router.post('/api/histories/deleteMulti', ctrlHistory.deleteMulti);

//Routes report
router.get('/api/reports', ctrlReport.index);
router.get('/api/reports/invoice', ctrlReport.getInvoiceList);
router.get('/pdf/invoicemc-:startDate-:endDate-:paymentTerm.pdf', ctrlReport.previewInvoiceMCCenter);
router.get('/pdf/invoicemc-:startDate-:endDate-:paymentTerm-:customer.pdf', ctrlReport.previewInvoiceMCCenter);
router.get('/pdf/daily-report-:date.pdf', ctrlReport.index);
router.get('/pdf/invoice-:customerId-:from-:to.pdf', ctrlReport.invoiceDetail);
router.get('/pdf/invoiceall-:type-:from-:to-:paymentTerm.pdf', ctrlReport.invoiceDetailAll);

router.get('/pdf/invoicecar-:customerId-:from-:to.pdf', ctrlReport.invoiceDetailCar);

module.exports = router;
