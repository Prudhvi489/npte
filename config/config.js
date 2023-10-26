const { Sequelize } = require('sequelize');
require('dotenv').config();

const sequelize = new Sequelize({
  dialect: process.env.DB_DIALECT,
  username: process.env.DB_USERNAME,
  password: process.env.DB_PASSWORD,
  database: process.env.DB_NAME,
  host: process.env.DB_HOST,
});

const ACCESS_TOKEN_SECRET = 'your-access-token-secret'; // Replace with a secure secret
const REFRESH_TOKEN_SECRET = 'your-refresh-token-secret'; // Replace with a secure secret
const PAYPAL_CLIENT_ID = 'ATDNt8JNfyPUXTiTRcKUW-dCp7yK4y1u9tQB3zU6vq4qbNoxNeHht8lXosTPs9A1XFaWxTgPQsq8zYHa';
const PAYPAL_CLIENT_SECRET = 'EHk3n1wAVCcmin8JwFx2s9CJkbnyv8eb1eGabMVaO47ZqaEDHNzHTmckuVnFpCRBjldtQk-qmsZTAsNw';
const baseUrl = process.env.BASE_URL;

sequelize
  .authenticate()
  .then(() => {
    console.log('Connection to database has been established successfully.');
  })
  .catch((err) => {
    console.error('Unable to connect to the database:', err);
  });

let config = {};
config.sequelize = sequelize;
config.Sequelize = Sequelize;
config.ACCESS_TOKEN_SECRET = ACCESS_TOKEN_SECRET;
config.REFRESH_TOKEN_SECRET = REFRESH_TOKEN_SECRET;
config.PAYPAL_CLIENT_ID = PAYPAL_CLIENT_ID;
config.PAYPAL_CLIENT_SECRET = PAYPAL_CLIENT_SECRET;
config.baseUrl = baseUrl;

module.exports = config;
