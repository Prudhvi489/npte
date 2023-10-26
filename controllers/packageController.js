const Package = require('../models/Package');
const responseHandler = require('../utils/responseHandler');
const { Op } = require('sequelize');

async function addPackage(req, res) {
  try {
    const { name, amount, discountedAmount, limitExams, expiredDate, description } = req.body;
    const uploadImage = req.file ? req.file.path : null;

    const newPackage = await Package.create({
      name,
      amount,
      discountedAmount,
      limitExams,
      expiredDate,
      uploadImage,
      description,
    });

    responseHandler.created(res, 'Package added successfully', newPackage);
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
async function editPackage(req, res) {
  try {
    const { id } = req.query;
 
    const { name, amount, discountedAmount, limitExams, expiredDate, description } = req.body;

    const packageToUpdate = await Package.findByPk(id);
    if (!packageToUpdate) {
      return responseHandler.notFound(res, 'Package not found');
    }

    if (name !== undefined) {
      packageToUpdate.name = name;
    }

    if (amount !== undefined) {
      packageToUpdate.amount = amount;
    }

    if (discountedAmount !== undefined) {
      packageToUpdate.discountedAmount = discountedAmount;
    }

    if (limitExams !== undefined) {
      packageToUpdate.limitExams = limitExams;
    }

    if (expiredDate !== undefined) {
      packageToUpdate.expiredDate = expiredDate;
    }

    if (description !== undefined) {
      packageToUpdate.description = description;
    }

    await packageToUpdate.save();

    responseHandler.success(res, 'Package updated successfully', packageToUpdate);
  } catch (error) {
    console.error(error);
    responseHandler.internalServerError(res, 'An error occurred');
  }
}
async function deletePackage(req, res) {
  try {
    const { id } = req.query;

    const packageToDelete = await Package.findByPk(id);
    if (!packageToDelete) {
      return responseHandler.notFound(res, 'Package not found');
    }

    await packageToDelete.destroy();

    responseHandler.success(res, 'Package deleted successfully');
  } catch (error) {
    console.error(error);
    responseHandler.internalServerError(res, 'An error occurred');
  }
}
async function getAllPackages(req, res) {
  try {
    const packages = await Package.findAll();

    responseHandler.success(res, 'All packages', { packages });
  } catch (error) {
    console.error(error);
    responseHandler.internalServerError(res, 'An error occurred');
  }
}
async function searchPackages(req, res) {
  try {
    const { query } = req.query;

    const searchResults = await Package.findAll({
      where: {
        [Op.or]: [
          { name: { [Op.iLike]: `%${query}%` } },
          { description: { [Op.iLike]: `%${query}%` } },
        ],
      },
    });

    responseHandler.success(res, 'Search results', { results: searchResults });
  } catch (error) {
    console.error(error);
    responseHandler.internalServerError(res, 'An error occurred');
  }
}
async function getAvailablePackages(req, res) {
try {
    // Fetch available packages with required attributes
    const packages = await Package.findAll({
     attributes: ['name', 'amount', 'description'], // Adjust the attributes as needed
    });

    responseHandler.success(res, 'Available packages', { packages });
} catch (error) {
    console.error(error);
    responseHandler.internalServerError(res, 'An error occurred');
}
}

module.exports = {
  addPackage,
  editPackage,
  deletePackage,
  getAllPackages,
  searchPackages,
  getAvailablePackages,
  getQuestionById
};
