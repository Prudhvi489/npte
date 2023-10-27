const express = require('express');
const router = express.Router();
const questionController = require('../controllers/questionController');
const authenticateToken = require('../middleware/authMiddleware');
router.post('/add', questionController.addQuestion);
router.post('/search', questionController.search);
router.get('/getAllQuestions', questionController.getAllQuestions);
router.delete('/deleteQuestion/:id', questionController.deleteQuestion);
router.put('/editQuestion', questionController.editQuestion);
router.get('/getQuestionById/:id', questionController.getQuestionById);
router.post('/getQuestionsByPackage/:packageName', questionController.getQuestionsByPackage);
router.get('/getQuestionsByGroupName/:groupName', questionController.getQuestionsByGroupName);
router.get('/questionsByExamId/:examId', questionController.getQuestionsByExamId);
router.post('/validateexam',authenticateToken,questionController.getexamresults)//authenticateToken







module.exports = router;
