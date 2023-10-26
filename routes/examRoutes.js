const express = require('express');
const router = express.Router();
const multer = require('multer'); 
const examController = require('../controllers/examController');
require('dotenv').config();

const storage = multer.diskStorage({
    destination: (req, file, cb) => {
      cb(null, `./uploads/`); 
    },
    filename: (req, file, cb) => {
      cb(null, new Date().toISOString() + '-' + file.originalname);
    },
  });
  const upload = multer({ storage });

  
router.post('/add',upload.single('uploadPhoto'), examController.addExam);
router.post('/updateExam',upload.single('uploadPhoto'), examController.updateExam);
router.delete('/deleteExam', examController.deleteExam);
router.get('/getAllExams', examController.getAllExams);

router.get('/getExamDetails', examController.getExamDetails);

router.post('/searchExams', examController.searchExams);

module.exports = router;



