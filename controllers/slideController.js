const Slide = require('../models/Slide');
const responseHandler = require('../utils/responseHandler');
const { Op } = require('sequelize');

async function addSlide(req, res) {
  try {
    const { slidename, heading, content, ordering } = req.body;
    const uploadslide = req.file ? req.file.path : null;

    const newSlide = await Slide.create({
      slidename,
      heading,
      content,
      ordering,
      uploadslide,
    });

    responseHandler.created(res, 'Slide added successfully', newSlide);
  } catch (error) {
    console.error(error);
    responseHandler.internalServerError(res, 'An error occurred');
  }
}

async function getSlides(req, res) {
  console.log("hello");
  try {
    const slides = await Slide.findAll({
      attributes: ['id','slidename', 'heading', 'content', 'ordering', 'uploadslide'],
    });

    responseHandler.success(res, 'All slides retrieved successfully', slides);
  } catch (error) {
    console.error(error);
    responseHandler.internalServerError(res, 'An error occurred');
  }
}

async function searchSlides(req, res) {
  try {
    const { query } = req.query;

    const slides = await Slide.findAll({
      where: {
        [Op.or]: [
          { slidename: { [Op.iLike]: `%${query}%` } },
          { heading: { [Op.iLike]: `%${query}%` } },
          { content: { [Op.iLike]: `%${query}%` } },
        ],
      },
      attributes: ['slidename', 'heading', 'content', 'ordering', 'uploadslide'],
    });

    const responseData = {
      success: 1,
      message: 'Search results for slides',
      data: slides,
    };

    responseHandler.success(res, responseData);
  } catch (error) {
    console.error(error);
    const errorResponse = {
      success: 0,
      message: 'An error occurred',
    };
    responseHandler.internalServerError(res, errorResponse);
  }
}

async function editSlide(req, res) {
  try {
    
    const { id } = req.query;
    const { slidename, heading, content, ordering } = req.body;
    const uploadslide = req.file ? req.file.path : null;

    const slide = await Slide.findByPk(id);
    if (!slide) {
      return responseHandler.notFound(res, 'Slide not found');
    }

    slide.slidename = slidename;
    slide.heading = heading;
    slide.content = content;
    slide.ordering = ordering;
    if (uploadslide) {
      slide.uploadslide = uploadslide;
    }
    await slide.save();
    responseHandler.success(res, 'Slide updated successfully', slide);
  } catch (error) {
    console.error(error);
    responseHandler.internalServerError(res, 'An error occurred');
  }
}

async function deleteSlide(req, res) {
  try {
    const { id } = req.query;
    
    const slide = await Slide.findByPk(id);
    if (!slide) {
      return responseHandler.success(res, 'Slide not found'); 
    }
    await slide.destroy();
    responseHandler.success(res, 'Slide deleted successfully');
  } catch (error) {
    console.error(error);
    responseHandler.internalServerError(res, 'An error occurred');
  }
}

module.exports = {
  addSlide,
  getSlides,
  searchSlides,
  editSlide,
  deleteSlide,
};


