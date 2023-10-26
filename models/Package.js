const { DataTypes } = require('sequelize');
const {sequelize} = require('../config/config');

const Package = sequelize.define('Package', {
  name: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  amount: {
    type: DataTypes.FLOAT,
    allowNull: false,
  },
  discountedAmount: {
    type: DataTypes.FLOAT,
    allowNull: true,
  },
  limitExams: {
    type: DataTypes.INTEGER,
    allowNull: false,
  },
  expiredDate: {
    type: DataTypes.DATE,
    allowNull: false,
  },
  uploadImage: {
    type: DataTypes.STRING,
    allowNull: true,
  },
  description: {
    type: DataTypes.TEXT,
    allowNull: true,
  },
  examsMap: {
    type: DataTypes.JSONB,
    allowNull: true,
  },
});

module.exports = Package;
