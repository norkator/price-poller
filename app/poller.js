// Tutorial
// https://codeburst.io/an-introduction-to-web-scraping-with-node-js-1045b55c63f7

// Components
const requestPromise = require('request-promise');
const $ = require('cheerio');
const logger = require('../module/logger');
const dotenv = require('dotenv');
dotenv.config();



exports.GetLatestPrice = function (sequelizeObjects) {
  requestPromise(process.env.PRODUCT_URL)
    .then(function (html) {

      console.log(html);

    })
    .catch(function (err) {
      console.log(err);
    });
};
exports.GetLatestPrice = GetLatestPrice;
