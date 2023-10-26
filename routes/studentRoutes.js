const express = require('express');
const router = express.Router();
const multer = require('multer');
const studentsController = require('../controllers/studentController');
require('dotenv').config();

// Create a multer storage configuration for file uploads
const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, `./uploads/`);
  },
  filename: function (req, file, cb) {
    cb(null, file.originalname); // Use the original filename
  },
});

// Create a multer instance with the storage configuration
const upload = multer({ storage: storage });

// Define the routes for student operations with file upload
router.post('/createStudent', upload.single('uploadPhoto'), studentsController.createStudent);
router.get('/all', studentsController.getAllStudentDetails);
router.post('/send-email', studentsController.sendEmailToUser);
router.post('/editStudent/:id', studentsController.editStudent);
router.get('/deleteStudent/:id', studentsController.deleteStudent);

module.exports = router;
