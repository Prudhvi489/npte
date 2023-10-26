const express = require('express');
const router = express.Router();
const cartController = require('../controllers/cartController');
const authenticateToken = require('../middleware/authMiddleware');

router.post('/addToCart',authenticateToken, cartController.addToCart);
router.put('/updateCartItem', cartController.updateCartItem);
router.get('/viewCart', authenticateToken,cartController.viewCart);

module.exports = router;
