const Exam = require('../models/Exam');
const Package = require('../models/Package');
const Group = require('../models/Group');
const responseHandler = require('../utils/responseHandler');
const { Op } = require('sequelize');
const Question = require('../models/Question');

async function addExam(req, res) {
  try {
    const {
      name,
      passingPercentage,
      instructions,
      examDuration,
      attemptCount,
      startDate,
      endDate,
      uploadPhoto,
      breakTime,
      optionShuffle,
      selectGroup,
      packageName,  
    } = req.body;

    // Check if the package exists
    const foundPackage = await Package.findOne({ where: { name: packageName } });
    if (!foundPackage) {
      return responseHandler.badRequest(res, 'Package not found');
    }

    // Check if the group exists (You need to implement this part)
    const group = await Group.findOne({ where: { groupName: selectGroup } });
    if (!group) {
      return responseHandler.badRequest(res, 'Group not found');
    }

    // Add the exam
    const exam = await Exam.create({
      name,
      passingPercentage,
      instructions,
      examDuration,
      attemptCount,
      startDate,
      endDate,
      uploadPhoto,
      breakTime,
      optionShuffle,
      selectGroup,
      packageName
    });

    // Update the package's exams map
    const examsMap = foundPackage.examsMap || {}; // Existing exams map or create a new one
    examsMap[name] = exam.id; // Assuming you want to map exam name to exam ID
    foundPackage.examsMap = examsMap;

    await foundPackage.save();

    responseHandler.created(res, 'Exam added successfully', { exam });
  } catch (error) {
    console.error(error);
    responseHandler.internalServerError(res, 'An error occurred');
  }
}


async function updateExam(req, res) {
  try {
    const { id } = req.query;
    const {
      name,
      passingPercentage,
      instructions,
      examDuration,
      attemptCount,
      startDate,
      endDate,
      uploadPhoto,
      breakTime,
      optionShuffle,
      selectGroup,
      packageName,   // Added package name field
    } = req.body;

    const exam = await Exam.findByPk(id);

    if (!exam) {
      return responseHandler.notFound(res, 'Exam not found');
    }

    // Check if the package exists
    let updatedFields = {
      name,
      passingPercentage,
      instructions,
      examDuration,
      attemptCount,
      startDate,
      endDate,
      uploadPhoto,
      breakTime,
      optionShuffle,
      selectGroup,
    };

    // Update the fields that are provided in the request body
    for (const [key, value] of Object.entries(updatedFields)) {
      if (value !== undefined) {
        exam[key] = value;
      }
    }

    // If package name is provided, update the package's exams map
    if (packageName) {
      const package = await Package.findOne({ where: { name: packageName } });
      if (!package) {
        return responseHandler.badRequest(res, 'Package not found');
      }
      const examsMap = package.examsMap || {};
      examsMap[exam.name] = exam.id;
      package.examsMap = examsMap;
      await package.save();
      updatedFields.packageName = packageName; // Track the updated parameter
    }

    await exam.save();

    responseHandler.success(res, 'Exam updated successfully', updatedFields);
  } catch (error) {
    console.error(error);
    responseHandler.internalServerError(res, 'An error occurred');
  }
}

async function deleteExam(req, res) {
  try {
    const { id } = req.query;

    const exam = await Exam.findByPk(id);

    if (!exam) {
      return responseHandler.notFound(res, 'Exam not found');
    }

    await exam.destroy();

    responseHandler.success(res, 'Exam deleted successfully');
  } catch (error) {
    console.error(error);
    responseHandler.internalServerError(res, 'An error occurred');
  }
}
async function getAllExams(req, res) {
  try {
    const exams = await Exam.findAll();

    const examsWithStaticFields = exams.map(exam => ({
      ...exam.toJSON(),
      type: 'Exam',     
      statusCode: null,   
      result: null,       
    }));

    responseHandler.success(res, 'All exams', { exams: examsWithStaticFields });
  } catch (error) {
    console.error(error);
    responseHandler.internalServerError(res, 'An error occurred');
  }
}

async function searchExams(req, res) {
  try {
    const { query, selectGroup } = req.query;

    const whereCondition = {
      name: { [Op.iLike]: `%${query}%` },
    };

    if (selectGroup) {
      whereCondition.selectGroup = selectGroup;
    }

    const exams = await Exam.findAll({
      where: whereCondition,
      attributes: ['id', 'name', 'passingPercentage', 'startDate', 'endDate', 'selectGroup'],
    });

    responseHandler.success(res, 'Search results', { exams });
  } catch (error) {
    console.error(error);
    responseHandler.internalServerError(res, 'An error occurred');
  }
}

async function getExamDetails(req, res) {
  try {
    const exams = await Exam.findAll({
      attributes: ['id', 'name', 'uploadPhoto'],
    });

    // Fetch the count of questions for each exam
    const examDetails = await Promise.all(exams.map(async (exam) => {
      const questionCount = await Question.count({
        where: { examId: exam.id },
      });

      return {
        name: exam.name,
        uploadPhoto: exam.uploadPhoto,
        questionCount,
      };
    }));

    res.json({ success: 1, message: 'Exam details retrieved successfully', data: examDetails });
  } catch (error) {
    console.error(error);
    res.status(500).json({ success: false, message: 'An error occurred' });
  }
}




module.exports = {
  addExam,
  updateExam,
  deleteExam,
  getAllExams,
  searchExams,
  getExamDetails
  
};
