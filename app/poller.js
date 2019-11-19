// Tutorial
// https://codeburst.io/an-introduction-to-web-scraping-with-node-js-1045b55c63f7

// Components
const requestPromise = require('request-promise');
const $ = require('cheerio');
const logger = require('../module/logger');
let email = require('./email');
const dotenv = require('dotenv');
dotenv.config();


exports.GetLatestPrice = function (sequelizeObjects) {
  return new Promise(function (resolve, reject) {
    GetProduct(sequelizeObjects, process.env.PRODUCT_CODE).then(product => {

      requestPromise(process.env.PRODUCT_URL)
        .then(function (html) {

          let price = 0.0;

          $('div .price-tag__price-tag-content', html).each(function (i, elem) {
            // console.log(String($('div > div', elem).text()));
            $('div > div', elem).each(function (i, elem) {
              if (i === 0) {
                price = Number(String($(this).text()).replace(',', '.'));
              }
            });
          });

          if (product === null) {
            InsertOrUpdateProduct(sequelizeObjects, process.env.PRODUCT_CODE, price, price).then(() => {
              resolve('New product ' + process.env.PRODUCT_CODE + ' entry first time insert');
            }).catch(error => {
              reject(error);
            });
          } else {
            const currentDbPrice = Number(product.current_price);
            if (price < currentDbPrice) {
              InsertOrUpdateProduct(sequelizeObjects, process.env.PRODUCT_CODE, null, price).then(() => {
                email.SendEmail(process.env.PRODUCT_URL, product.original_price, product.current_price);
                resolve('Product ' + process.env.PRODUCT_CODE + ' entry update');
              }).catch(error => {
                reject(error);
              });
            } else {
              resolve('Product ' + process.env.PRODUCT_CODE + ' no change in price')
            }
          }

        }).catch(function (err) {
        console.log(err);
      });

    }).catch(error => {
      reject(error);
    });
  });
};


function GetProduct(sequelizeObjects, productCode) {
  return new Promise(function (resolve, reject) {
    sequelizeObjects.Product.findAll({
      limit: 1,
      where: {
        product_code: productCode
      },
    }).then(products => {
      if (products.length > 0) {
        resolve(products[0].toJSON())
      } else {
        resolve(null);
      }
    });
  });
}


function InsertOrUpdateProduct(sequelizeObjects, productCode, originalPrice, currentPrice) {
  return new Promise(function (resolve, reject) {
    sequelizeObjects.Product.findAll({
      limit: 1,
      where: {
        product_code: productCode
      },
    }).then(obj => {
      if (obj.length > 0) {
        obj[0].update(
          {
            current_price: currentPrice
          }
        ).then(() => {
          resolve();
        });
      } else {
        sequelizeObjects.Product.create(
          {
            product_code: productCode,
            original_price: originalPrice,
            current_price: currentPrice
          }
        ).then(() => {
          resolve();
        }).catch(() => {
          reject();
        });
      }
    });
  });
}

