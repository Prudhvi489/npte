const Question = require('../models/Question');
const Exam = require('../models/Exam');
const Package = require('../models/Package');
const Student = require('../models/Student');
const responseHandler = require('../utils/responseHandler');

async function dashboard(req, res) {
  try {
    const totalQuestions = await Question.count();
    const totalTests = await Exam.count();
    const totalPackages = await Package.count();
    const totalStudents = await Student.count();
    const todaySale = 0; 

    const exams = await Exam.findAll({
      attributes: ['startDate', 'name', 'examDuration', 'passingPercentage'],
      include: [
        {
          model: Package,
          attributes: ['name', 'amount'],
        },
      ],
    });

    responseHandler.success(res, 'Data retrieved successfully', {
      totalQuestions,
      totalTests,
      totalPackages,
      totalStudents,
      todaySale,
      exams,
    });
  } catch (error) {
    console.error(error);
    responseHandler.internalServerError(res, 'An error occurred');
  }
}

module.exports = {
  dashboard,
};
