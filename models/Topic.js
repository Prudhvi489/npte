const { DataTypes } = require('sequelize');
const {sequelize} = require('../config/config');

const Topic = sequelize.define('Topic', {
  subjectName: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  topicName: {
    type: DataTypes.STRING,
    allowNull: false,
  },
});

module.exports = Topic;
