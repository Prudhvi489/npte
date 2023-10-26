const express = require('express');
const router = express.Router();
const multer = require('multer'); 
const packageController = require('../controllers/packageController');
const authenticateToken = require('../middleware/authMiddleware');

const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, 'uploads/'); 
  },
  filename: (req, file, cb) => {
    cb(null, new Date().toISOString() + '-' + file.originalname);
  },
});
const upload = multer({ storage });

router.post('/addpackage', upload.single('uploadImage'), packageController.addPackage);
router.post('/editPackage', upload.single('uploadImage'), packageController.editPackage);
router.delete('/deletePackage', packageController.deletePackage);
router.get('/getAllPackages', packageController.getAllPackages);
router.get('/getAvailablePackages', packageController.getAvailablePackages);
router.post('/searchPackages',  packageController.searchPackages);

module.exports = router;   


