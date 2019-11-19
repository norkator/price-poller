// Components
const config = require('../config');
const Sequelize = require('sequelize');
const dotenv = require('dotenv');
dotenv.config();


// Models
const ProductModel = require('../models/product');


// Sequelize instance
const sequelize = new Sequelize(process.env.DB_DATABASE, process.env.DB_USER, process.env.DB_PASSWORD, {
  port: process.env.DB_PORT,
  host: process.env.DB_HOST,
  dialect: process.env.DB_DIALECT,
  pool: {
    max: 10,
    min: 0,
    idle: 10000
  },
  logging: function (str) {
    if ((process.env.SEQ_LOGGING === 'true')) {
      console.log(str);
    }
  },
});

// Initialize models
const Product = ProductModel(sequelize, Sequelize);


// Export models
module.exports = {
  Product
};
