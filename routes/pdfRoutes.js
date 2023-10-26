const express = require('express');
const pdfController = require('../controllers/pdfController');

const router = express.Router();

router.get('/download/:filename', pdfController.downloadPdf);

module.exports = router;

