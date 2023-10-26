const { DataTypes } = require('sequelize');
const {sequelize} = require('../config/config');

const Student = sequelize.define('Student', {
  email: {
    type: DataTypes.STRING,
    allowNull: false,
    unique: true,
  },
  name: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  phone: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  uploadPhoto: {
    type: DataTypes.STRING,
    allowNull: true,
  },
  group: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  password: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  statusCode: {
    type: DataTypes.ENUM('Active', 'Pending', 'Suspend'),
    allowNull: false,
  },

  registeredDate: {
    type: DataTypes.DATE,
    defaultValue: sequelize.literal('CURRENT_TIMESTAMP'),
  },
});

module.exports = Student;
