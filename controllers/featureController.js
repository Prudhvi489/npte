const { Op } = require('sequelize');
const Feature = require('../models/Feature');
const responseHandler = require('../utils/responseHandler');

async function addFeature(req, res) {
  try {
    const { title, description } = req.body;
    const image = req.file ? req.file.path : null;

    const newFeature = await Feature.create({
      title,
      description,
      image,
    });
    responseHandler.created(res, 'Feature added successfully', newFeature);
  } catch (error) {
    console.error(error);
    responseHandler.internalServerError(res, 'An error occurred');
  }
}

async function getFeatures(req, res) {
  try {
    const features = await Feature.findAll({
      attributes: ['id','title', 'description', 'image'],
    });

    responseHandler.success(res, 'All features retrieved successfully', features);
  } catch (error) {
    console.error(error);
    responseHandler.internalServerError(res, 'An error occurred');
  }
}

async function searchFeatures(req, res) {
  try {
    const { query } = req.query;

    const features = await Feature.findAll({
      where: {
        [Op.or]: [
          { title: { [Op.iLike]: `%${query}%` } },
          { description: { [Op.iLike]: `%${query}%` } },
        ],
      },
      attributes: ['title', 'description', 'image'],
    });

    responseHandler.success(res, 'Search results for features', features);
  } catch (error) {
    console.error(error);
    responseHandler.internalServerError(res, 'An error occurred');
  }
}

async function editFeature(req, res) {
  try {
    const { id } = req.query;
    const { title, description } = req.body;
    const image = req.file ? req.file.path : null;

    const feature = await Feature.findByPk(id);
    if (!feature) {
      return responseHandler.notFound(res, 'Feature not found');
    }

    feature.title = title;
    feature.description = description;
    if (image) {
      feature.image = image;
    }

    await feature.save();

    responseHandler.success(res, 'Feature updated successfully', feature);
  } catch (error) {
    console.error(error);
    responseHandler.internalServerError(res, 'An error occurred');
  }
}

async function deleteFeature(req, res) {
  try {
    const { id } = req.query;

    const feature = await Feature.findByPk(id);
    if (!feature) {
      return responseHandler.notFound(res, 'Feature not found');
    }

    await feature.destroy();

    responseHandler.success(res, 'Feature deleted successfully');
  } catch (error) {
    console.error(error);
    responseHandler.internalServerError(res, 'An error occurred');
  }
}

module.exports = {
  addFeature,
  getFeatures,
  searchFeatures,
  editFeature,
  deleteFeature,
};
