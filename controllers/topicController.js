const { Op } = require('sequelize');
const Topic = require('../models/Topic');
const Subject = require('../models/Subject');
const responseHandler = require('../utils/responseHandler');

async function addTopic(req, res) {
  try {
    const { subjectName, topicName } = req.body;
    const existingSubject = await Subject.findOne({
      where: { subjectName },
    });

    if (!existingSubject) {
      return responseHandler.badRequest(res, 'Subject is not available');
    }
    
    const topic = await Topic.create({
      subjectName,
      topicName,
    });

    responseHandler.created(res, 'Topic added successfully', { topic });
  } catch (error) {
    console.error(error);
    responseHandler.internalServerError(res, 'An error occurred');
  }
}

async function editTopic(req, res) {
  try {
    const { id } = req.query;
    const { subjectName, topicName } = req.body;


    const existingSubject = await Subject.findOne({
      where: { subjectName },
    });

    if (!existingSubject) {
      return responseHandler.badRequest(res, 'Subject is not available');
    }

    const topic = await Topic.findByPk(id);
    if (!topic) {
      return responseHandler.notFound(res, 'Topic not found');
    }

    topic.subjectName = subjectName;
    topic.topicName = topicName;
    await topic.save();

    responseHandler.success(res, 'Topic updated successfully', { topic });
  } catch (error) {
    console.error(error);
    responseHandler.internalServerError(res, 'An error occurred');
  }
}

async function deleteTopic(req, res) {
  try {
    const { id } = req.query;

    const topic = await Topic.findByPk(id);
    if (!topic) {
      return responseHandler.notFound(res, 'Topic not found');
    }

    await topic.destroy();

    responseHandler.success(res, 'Topic deleted successfully');
  } catch (error) {
    console.error(error);
    responseHandler.internalServerError(res, 'An error occurred');
  }
}

async function getAllTopics(req, res) {
  try {
    const topics = await Topic.findAll();

    responseHandler.success(res, 'All topics', { topics });
  } catch (error) {
    console.error(error);
    responseHandler.internalServerError(res, 'An error occurred');
  }
}

async function searchTopics(req, res) {
  try {
    const { query } = req.query;
    const searchResults = await Topic.findAll({
      where: {
        topicName: { [Op.iLike]: `%${query}%` },
      },
    });
    responseHandler.success(res, 'Search results', { results: searchResults });
  } catch (error) {
    console.error(error);
    responseHandler.internalServerError(res, 'An error occurred');
  }
}
async function getTopicById(req, res) {
  try {
    const { id } = req.params; 
    const topic = await Topic.findByPk(id);

    if (!topic) {
      return responseHandler.notFound(res, 'Topic not found');
    }

    responseHandler.success(res, 'Topic found', { topic });
  } catch (error) {
    console.error(error);
    responseHandler.internalServerError(res, 'An error occurred');
  }
}

module.exports = {
  addTopic,
  editTopic,
  deleteTopic,
  getAllTopics,
  searchTopics,
  getTopicById
};
