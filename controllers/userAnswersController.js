
// controllers/userAnswersController.js

const UserAnswers = require('../models/UserAnswers');
const Question = require('../models/Question');

async function calculateScores(userId, questionId, userAnswer) {
  try {
    // Fetch the question details including the correct answer
    const question = await Question.findByPk(questionId);
    if (!question) {
      throw new Error('Question not found');
    }
    const { correctOption, marks } = question;
    // Check if the user's answer is correct
    const isCorrect = userAnswer === correctOption;

    // Calculate the score based on correctness
    const score = isCorrect ? marks : 0;

    // Update the UserAnswers table with the calculated score
    await UserAnswers.create({
      userId,
      questionId,
      userAnswer,
      score,
    });
  } catch (error) {
    console.error(error);
    throw new Error('Error calculating scores');
  }
}

module.exports = {
  calculateScores,
};









