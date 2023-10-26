const Group = require('../models/Group');
const responseHandler = require('../utils/responseHandler');
const { Op } = require('sequelize');

async function addGroup(req, res) {
  try {
    const { groupName } = req.body;

    const newGroup = await Group.create({
      groupName,
    });

    responseHandler.created(res, 'Group added successfully', newGroup);
  } catch (error) {
    console.error(error);
    responseHandler.internalServerError(res, 'An error occurred');
  }
}

async function updateGroup(req, res) {
  try {
    const { id } = req.query;
    const { groupName } = req.body;

    const group = await Group.findByPk(id);

    if (!group) {
      return responseHandler.notFound(res, 'Group not found');
    }

    await group.update({
      groupName,
    });

    responseHandler.success(res, 'Group updated successfully');
  } catch (error) {
    console.error(error);
    responseHandler.internalServerError(res, 'An error occurred');
  }
}
async function deleteGroup(req, res) {
  try {
    const { id } = req.query;

    const group = await Group.findByPk(id);

    if (!group) {
      return responseHandler.notFound(res, 'Group not found');
    }

    await group.destroy();

    responseHandler.success(res, 'Group deleted successfully');
  } catch (error) {
    console.error(error);
    responseHandler.internalServerError(res, 'An error occurred');
  }
}

async function getAllGroups(req, res) {
  try {
    const groups = await Group.findAll({
      attributes: ['id', 'groupName'],
    });

    responseHandler.success(res, 'All groups', { groups });
  } catch (error) {
    console.error(error);
    responseHandler.internalServerError(res, 'An error occurred');
  }
}

async function searchGroups(req, res) {
  try {
    const { query } = req.query;
    console.log(query);

    const groups = await Group.findAll({
      where: {
        groupName: { [Op.iLike]: `%${query}%` },
      },
      attributes: ['id', 'groupName'],
    });

    responseHandler.success(res, 'Search results', { groups });
  } catch (error) {
    console.error(error);
    responseHandler.internalServerError(res, 'An error occurred');
  }
}

module.exports = {
  addGroup,
  updateGroup,
  deleteGroup,
  getAllGroups,
  searchGroups,
};
