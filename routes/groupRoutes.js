const express = require('express');
const router = express.Router();
const groupController = require('../controllers/groupController');
const authenticateToken = require('../middleware/authMiddleware');

router.post('/addgroup',groupController.addGroup);
router.post('/updateGroup', groupController.updateGroup);
router.delete('/deleteGroup', groupController.deleteGroup);
router.get('/getAllGroups', groupController.getAllGroups);
router.post('/searchGroups', groupController.searchGroups);

module.exports = router;















