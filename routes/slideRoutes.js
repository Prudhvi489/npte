const express = require('express');
const router = express.Router();
const multer = require('multer'); 
const slideController = require('../controllers/slideController');
const authenticateToken = require('../middleware/authMiddleware');
require('dotenv').config();

// Define the base URL without "http://"

const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, `./uploads/`); 
  },
  filename: (req, file, cb) => {
    cb(null, new Date().toISOString() + '-' + file.originalname);
  },
});
const upload = multer({ storage });

router.post('/addSlide', upload.single('uploadslide'), slideController.addSlide);
router.post('/getSlides', upload.single('uploadslide'), slideController.getSlides);
router.post('/searchSlides', upload.single('uploadslide'), slideController.searchSlides);
router.put('/editSlide', upload.single('uploadslide'), slideController.editSlide);
router.delete('/deleteSlide', slideController.deleteSlide); 

module.exports = router;
