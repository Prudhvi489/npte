const express = require('express');
const router = express.Router();
const multer = require('multer');
const testimonialController = require('../controllers/testimonialController');
const authenticateToken = require('../middleware/authMiddleware');
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

router.post('/addTestimonial', upload.single('uploadslide'), testimonialController.addTestimonial);
router.put('/editTestimonial/:id', upload.single('uploadslide'), testimonialController.editTestimonial);
router.delete('/deleteTestimonial/:id', testimonialController.deleteTestimonial);
router.get('/getTestimonials', testimonialController.getTestimonials);
router.post('/searchTestimonials', testimonialController.searchTestimonials);

module.exports = router;
