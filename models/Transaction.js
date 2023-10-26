const { DataTypes } = require('sequelize');
const { sequelize } = require('../config/config');

const Transaction = sequelize.define('Transaction', {
  paymentId: {
    type: DataTypes.STRING,
    allowNull: false,
    unique: true,
  },
  payerId: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  amount: {
    type: DataTypes.DECIMAL(10, 2),
    allowNull: false,
  },
  currency: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  userName: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  userEmail: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  userPhone: {
    type: DataTypes.STRING,
  },
  transactionId: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  paymentGatewayId: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  cartAmount: {
    type: DataTypes.DECIMAL(10, 2),
    allowNull: false,
  },
  transactionAmount: {
    type: DataTypes.DECIMAL(10, 2),
    allowNull: false,
  },
  transactionDate: {
    type: DataTypes.DATE,
    allowNull: false,
  },
  transactionStatus: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  paymentMode: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  status: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  packageId: {
    type: DataTypes.INTEGER,
    allowNull: false,
  },
  packageName: {
    type: DataTypes.STRING,
    allowNull: false,
  },
});

module.exports = Transaction;
