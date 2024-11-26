//routes/customerServiceRoutes
const express = require('express');
const router = express.Router();
//const customerServiceController = require('../../controllers/customerServiceController');
const customerServiceController = require('../controllers/CustomerServiceController');

const { protect } = require('../middleware/auth');
router.get('/init', protect, customerServiceController.initializeCustomerService);
router.post('/message', protect, customerServiceController.handleBotMessage);

module.exports = router;