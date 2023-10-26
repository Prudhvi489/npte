const express = require('express');
const router = express.Router();
const multer = require('multer');
const blogController = require('../controllers/blogController');

// Define the path to the PDFs folder

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

router.post('/add', upload.single('image'), blogController.addBlog);
router.get('/getBlogTitles' , blogController.getBlogTitles);
router.delete('/deleteBlog',blogController.deleteBlog);
router.post('/searchBlogs',  blogController.searchBlogs);
router.put('/editBlog', upload.single('image'), blogController.editBlog);


module.exports = router;

