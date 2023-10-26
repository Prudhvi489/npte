const { DataTypes } = require('sequelize');
const  {sequelize}  = require('../config/config');

const PaymentOption = sequelize.define('PaymentOption', {
  name: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  userName: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  password: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  signature: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  sandboxMode: {
    type: DataTypes.BOOLEAN,
    allowNull: false,
    defaultValue: false, // Default value is false
  },
  published: {
    type: DataTypes.BOOLEAN,
    allowNull: false,
    defaultValue: false, // Default value is false
  },
});

module.exports = PaymentOption;

























