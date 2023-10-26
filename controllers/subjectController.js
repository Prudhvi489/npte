const Subject = require('../models/Subject');
const Group = require('../models/Group');
const responseHandler = require('../utils/responseHandler');
const { Op } = require('sequelize');

async function addSubject(req, res) {
  try {
    const { groupName, subjectName } = req.body;

    const groupExists = await Group.findOne({ where: { groupName } });
    if (!groupExists) {
      return responseHandler.badRequest(res, 'Group not available');
    }

    const subject = await Subject.create({
      groupName,
      subjectName,
    });

    responseHandler.created(res, 'Subject added successfully', { subject });
  } catch (error) {
    console.error(error);
    responseHandler.internalServerError(res, 'An error occurred');
  }
}

async function editSubject(req, res) {
  try {
    const { id } = req.query;
    const { groupName, subjectName } = req.body;

    const groupExists = await Group.findOne({ where: { groupName } });
    if (!groupExists) {
      return responseHandler.badRequest(res, 'Group not available');
    }

    const subject = await Subject.findByPk(id);
    if (!subject) {
      return responseHandler.notFound(res, 'Subject not found');
    }

    subject.groupName = groupName;
    subject.subjectName = subjectName;
    await subject.save();

    responseHandler.success(res, 'Subject updated successfully', { subject });
  } catch (error) {
    console.error(error);
    responseHandler.internalServerError(res, 'An error occurred');
  }
}

async function deleteSubject(req, res) {
  try {
    const { id } = req.query;
    console.log(id);

    const subject = await Subject.findByPk(id);
    if (!subject) {
      return responseHandler.notFound(res, 'Subject not found');
    }

    await subject.destroy();

    responseHandler.success(res, 'Subject deleted successfully');
  } catch (error) {
    console.error(error);
    responseHandler.internalServerError(res, 'An error occurred');
  }
}

async function getAllSubjects(req, res) {
  try {
    const subjects = await Subject.findAll();

    responseHandler.success(res, 'All subjects', { subjects });
  } catch (error) {
    console.error(error);
    responseHandler.internalServerError(res, 'An error occurred');
  }
}

async function searchSubjects(req, res) {
  try {
    const { query } = req.query;

    const searchResults = await Subject.findAll({
      where: {
        subjectName: { [Op.iLike]: `%${query}%` },
      },
    });

    responseHandler.success(res, 'Search results', { results: searchResults });
  } catch (error) {
    console.error(error);
    responseHandler.internalServerError(res, 'An error occurred');
  }
}

async function getSubjectById(req, res) {
  try {
    const { id } = req.params; // Use req.params to access the route parameter

    const subject = await Subject.findByPk(id);

    if (!subject) {
      return responseHandler.notFound(res, 'Subject not found');
    }

    responseHandler.success(res, 'Subject found', { subject });
  } catch (error) {
    console.error(error);
    responseHandler.internalServerError(res, 'An error occurred');
  }
}
module.exports = {
  addSubject,
  editSubject,
  deleteSubject,
  getAllSubjects,
  searchSubjects,
  getSubjectById
};
