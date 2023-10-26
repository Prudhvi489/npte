const { DataTypes } = require('sequelize');
const { sequelize } = require('../config/config');
const Exam = require('./Exam'); // Import the Exam model

const Question = sequelize.define('Question', {
  groupName: {
    type: DataTypes.ARRAY(DataTypes.STRING),
    allowNull: false,
  },
  topicName: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  subjectName: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  questionText: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  options: {
    type: DataTypes.JSONB,
    allowNull: false,
  },
  correctOption: {
    type: DataTypes.INTEGER,
    allowNull: false,
  },
  marks: {
    type: DataTypes.INTEGER,
    allowNull: false,
  },
  examId: {
    type: DataTypes.INTEGER,
    allowNull: true,
    references: {
      model: 'Exams', 
      key: 'id',      
    },
  },
});

// Define the association between Exam and Question
Exam.hasMany(Question, { foreignKey: 'examId' });
Question.belongsTo(Exam, { foreignKey: 'examId' });

module.exports = Question;
