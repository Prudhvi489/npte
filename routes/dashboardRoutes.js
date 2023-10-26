const express = require('express');
const router = express.Router();
const dashboardController = require('../controllers/dashboardController');
const authenticateToken = require('../middleware/authMiddleware');
// router.get('/getTotalQuestions', dashboardController.getTotalQuestions);
// router.get('/getTotalTests',authenticateToken, dashboardController.getTotalTests);
// router.get('/getTotalPackages',authenticateToken, dashboardController.getTotalPackages);
// router.get('/getTotalStudents', authenticateToken,dashboardController.getTotalStudents);
// router.get('/getTodaySale',authenticateToken, dashboardController.getTodaySale);
// router.get('/getExamDetails', dashboardController.getExamDetails);
router.get('/dashboard', dashboardController.dashboard);



module.exports = router;