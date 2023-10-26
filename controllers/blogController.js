
const { Op } = require('sequelize');
const Blog = require('../models/Blog');
const responseHandler = require('../utils/responseHandler');
const fs = require('fs').promises; // Import the promises version of fs

async function addBlog(req, res) {
  try {
    const { title, description } = req.body;
    const photo = req.file ? req.file.path : null;

    const newBlog = await Blog.create({
      title,
      description,
      photo,
    });

    responseHandler.created(res, 'Blog added successfully', newBlog);
  } catch (error) {
    console.error(error);
    responseHandler.internalServerError(res, 'An error occurred');
  }
}
async function getBlogTitles(req, res) {
  try {
    const blogs = await Blog.findAll({
      attributes: ['id','title','description', 'status','photo'],
    });

    responseHandler.success(res, 'Blog titles retrieved successfully', blogs);
  } catch (error) {
    console.error(error);
    responseHandler.internalServerError(res, 'An error occurred');
  }
}
async function searchBlogs(req, res) {
  try {
    const { query } = req.query;

    const blogs = await Blog.findAll({
      where: {
        [Op.or]: [
          { title: { [Op.iLike]: `%${query}%` } },
          { description: { [Op.iLike]: `%${query}%` } },

        ],
      },
      attributes: ['title', 'status'],
    });

    responseHandler.success(res, 'Search results for blogs', blogs);
  } catch (error) {
    console.error(error);
    responseHandler.internalServerError(res, 'An error occurred');
  }
}
async function editBlog(req, res) {
  try {
    const { id } = req.query;
    const { title, description } = req.body;
    const photo = req.file ? req.file.path : null;

    const blog = await Blog.findByPk(id);
    if (!blog) {
      return responseHandler.notFound(res, 'Blog not found');
    }

    blog.title = title;
    blog.description = description;
    if (photo) {
      blog.photo = photo;
    }

    await blog.save();

    responseHandler.success(res, 'Blog updated successfully', blog);
  } catch (error) {
    console.error(error);
    responseHandler.internalServerError(res, 'An error occurred');
  }
}
async function deleteBlog(req, res) {
  try {
    const { id } = req.query;

    const blog = await Blog.findByPk(id);
    if (!blog) {
      return responseHandler.notFound(res, 'Blog not found');
    }

    await blog.destroy();

    responseHandler.success(res, 'Blog deleted successfully');
  } catch (error) {
    console.error(error);
    responseHandler.internalServerError(res, 'An error occurred');
  }
}

module.exports = {
  addBlog,
  getBlogTitles,
  searchBlogs,
  editBlog,
  deleteBlog,

};












