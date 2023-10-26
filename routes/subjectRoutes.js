const express = require('express');
const router = express.Router();
const subjectController = require('../controllers/subjectController');

router.post('/add', subjectController.addSubject);
router.put('/editSubject',subjectController.editSubject);
router.delete('/deleteSubject', subjectController.deleteSubject);
router.get('/getAllSubjects',subjectController.getAllSubjects);
router.post('/searchSubjects', subjectController.searchSubjects);
router.get('/getSubjectById/:id', subjectController.getSubjectById);


module.exports = router;
