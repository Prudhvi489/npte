const { DataTypes } = require('sequelize');
const {sequelize} = require('../config/config');

const Feature = sequelize.define('Feature', {
  title: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  description: {
    type: DataTypes.TEXT,
    allowNull: false,
  },
  image: {
    type: DataTypes.STRING,
    allowNull: true,
  },
});

module.exports = Feature;
