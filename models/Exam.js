const { DataTypes } = require('sequelize');
const {sequelize} = require('../config/config');
const Package = require('../models/Package');
const Exam = sequelize.define('Exam', {
  name: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  passingPercentage: {
    type: DataTypes.FLOAT,
    allowNull: false,
  },
  instructions: {
    type: DataTypes.TEXT,
    allowNull: true,
  },
  examDuration: {
    type: DataTypes.INTEGER,
    allowNull: false,
  },
  attemptCount: {
    type: DataTypes.INTEGER,
    allowNull: false,
  },

  startDate: {
    type: DataTypes.DATE,
    allowNull: false,
  },
  endDate: {
    type: DataTypes.DATE,
    allowNull: false,
  },
  uploadPhoto: {
    type: DataTypes.STRING,
    allowNull: true,
  },
  breakTime: {
    type: DataTypes.INTEGER,
    allowNull: true,
  },
  optionShuffle: {
    type: DataTypes.BOOLEAN,
    allowNull: false,
  },

  selectGroup: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  packageName: {
    type: DataTypes.STRING,
    allowNull: false,
  },
});
Exam.belongsTo(Package, { foreignKey: 'packageId' }); // Assuming you have a 'packageId' column in the Exam table

module.exports = Exam;
