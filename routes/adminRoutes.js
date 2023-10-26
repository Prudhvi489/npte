
const express = require('express');
const router = express.Router();
const adminController = require('../controllers/adminController');

router.post('/adminregister', adminController.registerAdmin);
router.post('/adminlogin', adminController.loginAdmin);
router.get('/getAdminDetails', adminController.getAdminDetails);
router.put('/updatePassword', adminController.updatePassword);

module.exports = router;
