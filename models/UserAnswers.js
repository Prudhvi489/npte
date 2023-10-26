// models/UserAnswers.js

const { DataTypes } = require('sequelize');
const { sequelize } = require('../config/config');

const UserAnswers = sequelize.define('UserAnswers', {
  id: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true,
  },
  userId: {
    type: DataTypes.INTEGER,
    allowNull: false,
  },
  questionId: {
    type: DataTypes.INTEGER,
    allowNull: false,
  },
  userAnswer: {
    type: DataTypes.INTEGER,
    allowNull: false,
  },
  score: {
    type: DataTypes.INTEGER,
    defaultValue: 0,
  },
});

module.exports = UserAnswers;

















