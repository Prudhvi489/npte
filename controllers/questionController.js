const { Op } = require('sequelize');
const Question = require('../models/Question');
const Topic = require('../models/Topic');
const Subject = require('../models/Subject');
const Group = require('../models/Group'); // Import Group model
const responseHandler = require('../utils/responseHandler');
const Exam = require('../models/Exam');
const { Sequelize } = require('sequelize');
async function addQuestion(req, res) {
  try {
    const {
      groupName,
      topicName,
      subjectName,
      questionText,
      options,
      correctOption, // This should contain the index of the correct option
      marks,
      examName, // Change from examId to examName
    } = req.body;

    // Validate that correctOption is within the range of available options
    if (correctOption < 0 || correctOption >= options.length) {
      return responseHandler.badRequest(res, 'Invalid correctOption');
    }

    // Find the exam by name to get the examId
    const exam = await Exam.findOne({ where: { name: examName } });

    if (!exam) {
      return responseHandler.badRequest(res, 'Exam not found');
    }

    // Create the question with the correct answer and associated examId
    const question = await Question.create({
      groupName,
      topicName,
      subjectName,
      questionText,
      options,
      correctOption, // Store the index of the correct option
      marks,
      examId: exam.id, // Associate the question with the exam by using its examId
    });

    responseHandler.created(res, 'Question added successfully', { question });
  } catch (error) {
    console.error(error);
    responseHandler.internalServerError(res, 'An error occurred');
  }
}


async function editQuestion(req, res) {
try {
  const { id } = req.query;

  const {
    groupName,
    topicName,
    subjectName,
    questionText,
    options,
    correctOption,
    marks,
  } = req.body;

  const existingTopic = await Topic.findOne({
    where: { topicName },
  });

  if (!existingTopic) {
    return responseHandler.badRequest(res, 'Topic is not available');
  }

  const existingSubject = await Subject.findOne({
    where: { subjectName },
  });

  if (!existingSubject) {
    return responseHandler.badRequest(res, 'Subject is not available');
  }

  const existingGroup = await Group.findOne({
    where: { groupName },
  });

  if (!existingGroup) {
    return responseHandler.badRequest(res, 'Group is not available');
  }

  const question = await Question.findByPk(id);

  if (!question) {
    return responseHandler.notFound(res, 'Question not found');
  }

  question.groupName = groupName;
  question.topicName = topicName;
  question.subjectName = subjectName;
  question.questionText = questionText;
  question.options = options;
  question.correctOption = correctOption;
  question.marks = marks;
  
  await question.save();

  responseHandler.success(res, 'Question updated successfully', { question });
} catch (error) {
  console.error(error);
  responseHandler.internalServerError(res, 'An error occurred');
}
}

async function deleteQuestion(req, res) {
  try {
    const { id } = req.params;

    const question = await Question.findByPk(id);
    if (!question) {
      return responseHandler.notFound(res, 'Question not found');
    }

    await question.destroy();

    responseHandler.success(res, 'Question deleted successfully');
  } catch (error) {
    console.error(error);
    responseHandler.internalServerError(res, 'An error occurred');
  }
}

async function search(req, res) {
  try {
      const { query, subject, topic, group } = req.query;
  
      const whereCondition = {
      [Op.or]: [
          { subjectName: { [Op.iLike]: `%${query}%` } },
          { topicName: { [Op.iLike]: `%${query}%` } },
          { questionText: { [Op.iLike]: `%${query}%` } },
      ],
      };
  
      if (subject) {
      whereCondition.subjectName = subject;
      }
  
      if (topic) {
      whereCondition.topicName = topic;
      }
  
      if (group) {
      whereCondition.groupName = group;
      }
  
      const searchResults = await Question.findAll({
      where: whereCondition,
      });
  
      responseHandler.success(res, 'Search results', { results: searchResults });
  } catch (error) {
      console.error(error);
      responseHandler.internalServerError(res, 'An error occurred');
  }
  }
    
async function getAllQuestions(req, res) {
    try {
      const questions = await Question.findAll({

        attributes: ['id', 'questionText', 'subjectName', 'topicName', 'groupName','options','correctOption','marks'],
      });
      responseHandler.success(res, 'All questions', { questions });
    } catch (error) {
      console.error(error);
      responseHandler.internalServerError(res, 'An error occurred');
    }
}
async function getQuestionById(req, res) {
  try {
    const { id } = req.params;

    const question = await Question.findByPk(id);

    if (!question) {
      return responseHandler.notFound(res, 'Question not found');
    }

    responseHandler.success(res, 'Question found', { question });
  } catch (error) {
    console.error(error);
    responseHandler.internalServerError(res, 'An error occurred');
  }
}
async function getQuestionsByPackage(req, res) {
  try {
    const { groupName } = req.query; // Assuming you pass the package name as a URL parameter
    // Fetch questions based on the package name
    const questions = await Question.findAll({
      where: { groupName }, // Adjust the field name as per your database schema
      attributes: ['id', 'questionText', 'options', 'correctOption', 'subjectName'], // Add more attributes as needed
    });

    responseHandler.success(res, 'Questions retrieved successfully', { questions });
  } catch (error) {
    console.error(error);
    responseHandler.internalServerError(res, 'An error occurred');
  }
}

async function getQuestionsByGroupName(req, res) {
  try {
    const { groupName } = req.params; 

    // Query the database to find questions with the specified groupName
    const questions = await Question.findAll({
      where: {
        groupName: {
          [Op.like]: `%${groupName}%`
        }
      },
    });

    if (!questions || questions.length === 0) {
      return responseHandler.notFound(res, 'No questions found for the specified group name');
    }

    responseHandler.success(res, 'Questions retrieved successfully', { questions });
  } catch (error) {
    console.error(error);
    responseHandler.internalServerError(res, 'An error occurred');
  }
}
  


async function getQuestionsByExamId(req, res) {
  try {
    const { examId } = req.params;
    // Query the database to find questions and include the associated exam
    const questions = await Question.findAll({
      where: { examId },
      include: {
        model: Exam, // Include the Exam model
        attributes: ['name', 'examDuration'], // Specify the attributes you want
      },
    });
    if (!questions || questions.length === 0) {
      return responseHandler.notFound(res, 'No questions found for the specified examId');
    }

    // Calculate the count of questions
    const questionCount = questions.length;

    // Extract exam name and duration from the first question (assuming they are the same for all questions)
    const examName = questions[0].Exam.name;
    const examDuration = questions[0].Exam.examDuration;

    responseHandler.success(res, 'Questions retrieved successfully', {
      examName,
      examDuration,
      questionCount,
      questions, // You can include the questions as well
    });
  } catch (error) {
    // console.error(error,"error");
    responseHandler.internalServerError(res, 'An error occurred');
  }
}

/**Valdating the exam results
 * @param{object}-req The request object contains exam_data(array of object),exam_id,total_questions
 * exam_data-object contains question_id,answer
 */
async function getexamresults(req,res){
  try{
    const UserId = req.user.id;
    const {exam_name,exam_id,exam_data,total_questions}=req.body;
    // Getting total marks using examid from quesitons table
    const questions = await Question.findAll({
      where: {examId:exam_id },
      attributes: [
        [Sequelize.fn('SUM', Sequelize.col('marks')), 'totalMarks'],
      ],
    })
    // Getting passing score from exams table
    const passing_percentage=await Exam.findOne({
      where:{id:exam_id},
      attributes: ['passingPercentage']
    })
  //  Retrieving all questions related to exam_id
  const all_questions = await Question.findAll({
    where: {examId:exam_id },
    include: {
      model: Exam,
      attributes: ['name', 'examDuration'], 
    },
  });
  let updated_questions = all_questions.map((question) => {
    const foundAnswer = exam_data.find((data) => data.questionid === question.id);
    if (foundAnswer) {
      return {
        ...question.dataValues,
        your_answer: foundAnswer.answer,
      };
    } else {
      return question.dataValues;
    }
  });
    let passing_score=passing_percentage?.dataValues?.passingPercentage;
    let total_marks=questions[0].get('totalMarks');
    let gained_marks=0;
    let correct=0;
    let accuracy=0;
    let incorrect
    for (let i=0;i<exam_data.length;i++){
      let question_id=exam_data[i]?.questionid;
    const question= await Question.findOne({
      where: { id: question_id }
    })

    if(exam_data[i]?.answer===question?.dataValues?.correctOption){
      correct+=1;
      gained_marks+=question?.dataValues?.marks;
    }
  }
  
  accuracy=(gained_marks/total_marks)*100;
  incorrect=total_questions-correct;
  responseHandler.success(res, 'Exam validated successfully', {
    accuracy,
    passing_score,
    correct,
    incorrect,
    updated_questions
  });
  }
  catch(err){
    console.log(err);
    responseHandler.internalServerError(res, 'An error occurred');
  }
}



module.exports = {
  addQuestion,
  editQuestion,
  deleteQuestion,
  search,
  getAllQuestions,
  getQuestionById,
  getQuestionsByPackage,
  getQuestionsByGroupName,
  getQuestionsByExamId,
  getexamresults
};


