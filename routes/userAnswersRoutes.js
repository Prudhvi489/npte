// routes/userAnswersRoutes.js

const express = require('express');
const router = express.Router();
const userAnswersController = require('../controllers/userAnswersController');

// POST route to submit user answers
router.post('/submit', async (req, res) => {
  
  try {
    const { userId, questionId, userAnswer } = req.body;

    // Call the controller to calculate and store scores
    await userAnswersController.calculateScores(userId, questionId, userAnswer);

    res.status(200).json({ message: 'Answer submitted successfully' });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'An error occurred' });
  }
});

module.exports = router;
