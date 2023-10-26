const express = require('express');
const router = express.Router();
const paymentController = require('../controllers/paymentController');
const authenticateToken = require('../middleware/authMiddleware');

// Add Payment Option
router.post('/addPaymentOption', authenticateToken, paymentController.addPaymentOption);
// Get Payment Options
router.get('/getPaymentOptions', authenticateToken, paymentController.getPaymentOptions);
router.get('/proceedToPayments', authenticateToken,paymentController.proceedToPayments);
router.get('/getPayments',paymentController.getPayments);
router.post('/searchByDate',paymentController.searchByDate);
router.post('/searchByName',paymentController.searchByName);

module.exports = router;

