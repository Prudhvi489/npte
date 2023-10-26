const { DataTypes } = require('sequelize');
const {sequelize} = require('../config/config');

const Testimonial = sequelize.define('Testimonial', {
  name: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  description: {
    type: DataTypes.TEXT,
    allowNull: false,
  },
  photo: {
    type: DataTypes.STRING,
    allowNull: true,
  },
  status: {
    type: DataTypes.INTEGER,
    defaultValue: 1, 
  },
}, {
  timestamps: true,
  underscored: true,
});

module.exports = Testimonial;

