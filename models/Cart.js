
const { DataTypes } = require('sequelize');
const {sequelize} = require('../config/config');
const Package = require('../models/Package');

const Cart = sequelize.define('Cart', {
  packageId: {
    type: DataTypes.INTEGER,
    allowNull: false,
  },
  quantity: {
    type: DataTypes.INTEGER,
    allowNull: false,
  },
  userId: { // Add this column
    type: DataTypes.INTEGER,
    allowNull: false,
  },
});

Cart.belongsTo(Package, { foreignKey: 'packageId' }); 
module.exports = Cart;





