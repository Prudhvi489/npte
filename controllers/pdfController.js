const path = require('path');
const pdfsFolderPath = path.join(__dirname, '../pdfs');

function downloadPdf(req, res) {
  const { filename } = req.params;
  const filePath = path.join(pdfsFolderPath, filename);
//   console.log(filePath);return;

  res.download(filePath, (err) => {
    if (err) {
      res.status(404).send('File not found');
    }
  });
}

module.exports = {
  downloadPdf,
};
