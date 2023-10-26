const express = require('express');
const router = express.Router();
const multer = require('multer'); 
const featureController = require('../controllers/featureController');
// const authenticateToken = require('../middleware/authMiddleware');
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, 'uploads/'); 
  },
  filename: (req, file, cb) => {
    cb(null, new Date().toISOString() + '-' + file.originalname);
  },
});
const upload = multer({ storage });

router.post('/addFeature', upload.single('image'), featureController.addFeature);
router.get('/getFeatures', featureController.getFeatures);
router.post('/searchFeatures', upload.single('image'), featureController.searchFeatures);
router.put('/editFeature', upload.single('image'), featureController.editFeature);
router.delete('/deleteFeature', featureController.deleteFeature);

module.exports = router;
