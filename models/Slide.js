const { DataTypes } = require('sequelize');
const {sequelize} = require('../config/config');

const Slide = sequelize.define('Slide', {
  slidename: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  heading: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  content: {
    type: DataTypes.TEXT,
    allowNull: false,
  },
  ordering: {
    type: DataTypes.INTEGER,
    allowNull: false,
  },
  uploadslide: {
    type: DataTypes.STRING,
    allowNull: true,
  },
});

module.exports = Slide;
