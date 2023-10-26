const express = require('express');
const router = express.Router();
const topicController = require('../controllers/topicController');

router.post('/add', topicController.addTopic);
router.put('/editTopic', topicController.editTopic);
router.delete('/deleteTopic', topicController.deleteTopic);
router.get('/getAllTopics', topicController.getAllTopics);
router.post('/searchTopics', topicController.searchTopics);
router.get('/getTopicById/:id', topicController.getTopicById);


module.exports = router;
