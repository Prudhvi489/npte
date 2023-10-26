const Testimonial = require('../models/Testimonial');
const responseHandler = require('../utils/responseHandler');
const { Op } = require('sequelize');

async function addTestimonial(req, res) {
  try {
    const { name, description, status } = req.body; // Add status to the request body
    const photo = req.file ? req.file.path : null;
    console.log(photo);

    const newTestimonial = await Testimonial.create({
      name,
      description,
      photo,
      status, // Include the status in the creation
    });

    responseHandler.created(res, 'Testimonial added successfully', newTestimonial);
  } catch (error) {
    console.error(error);
    responseHandler.internalServerError(res, 'An error occurred');
  }
}

async function getTestimonials(req, res) {
  try {
    const testimonials = await Testimonial.findAll({
      where: {
        status: 1, // Only retrieve active testimonials
      },
      attributes: ['id','name', 'description', 'photo'],
    });

    responseHandler.success(res, 'All testimonials retrieved successfully', testimonials);
  } catch (error) {
    console.error(error);
    responseHandler.internalServerError(res, 'An error occurred');
  }
}

async function searchTestimonials(req, res) {
  try {
    const { query } = req.query;

    const testimonials = await Testimonial.findAll({
      where: {
        [Op.or]: [
          { name: { [Op.iLike]: `%${query}%` } },
          { description: { [Op.iLike]: `%${query}%` } },
        ],
        status: 1, // Only retrieve active testimonials
      },
      attributes: ['name', 'description', 'photo'],
    });

    responseHandler.success(res, 'Search results for testimonials', testimonials);
  } catch (error) {
    console.error(error);
    responseHandler.internalServerError(res, 'An error occurred');
  }
}

async function editTestimonial(req, res) {
  try {
    const { id } = req.params;
    const { type } = req.body; // Add a 'type' field to specify the update type
    const testimonial = await Testimonial.findByPk(id);

    if (!testimonial) {
      return responseHandler.notFound(res, 'Testimonial not found');
    }

    if (type === 'type1') {
      // Type 1: Update 'name', 'description', or 'status' (any one or more)
      const { name, description, status } = req.body;

      // Check if at least one field is provided for update
      if (name !== undefined) {
        testimonial.name = name;
      }

      if (description !== undefined) {
        testimonial.description = description;
      }

      if (status !== undefined) {
        testimonial.status = status;
      }
    } else if (type === 'type2') {
      // Type 2: Update 'photo'
      const photo = req.file ? req.file.path : null;
      if (photo) {
        testimonial.photo = photo;
      }
    } else {
      return responseHandler.badRequest(res, 'Invalid update type');
    }

    await testimonial.save();

    responseHandler.success(res, 'Testimonial updated successfully', testimonial);
  } catch (error) {
    console.error(error);
    responseHandler.internalServerError(res, 'An error occurred');
  }
}

async function deleteTestimonial(req, res) {
  try {
    const { id } = req.params;

    const testimonial = await Testimonial.findByPk(id);
    if (!testimonial) {
      return responseHandler.notFound(res, 'Testimonial not found');
    }
    await testimonial.destroy();

    responseHandler.success(res, 'Testimonial deleted successfully');
  } catch (error) {
    console.error(error);
    responseHandler.internalServerError(res, 'An error occurred');
  }
}

module.exports = {
  addTestimonial,
  getTestimonials,
  searchTestimonials,
  editTestimonial,
  deleteTestimonial,
};
