const { DataTypes } = require('sequelize');
const {sequelize} = require('../config/config');
const Subject = sequelize.define('Subject', {
  groupName: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  subjectName: {
    type: DataTypes.STRING,
    allowNull: false,
  },
});
module.exports = Subject;