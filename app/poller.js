// Tutorial
// https://codeburst.io/an-introduction-to-web-scraping-with-node-js-1045b55c63f7

// Components
const requestPromise = require('request-promise');
const $ = require('cheerio');
const logger = require('../module/logger');
let email = require('./email');
const dotenv = require('dotenv');
dotenv.config();


async function asyncForEach(array, callback) {
  for (let index = 0; index < array.length; index++) {
    await callback(array[index], index, array);
  }
}


exports.GetLatestPrices = function (sequelizeObjects) {
  return new Promise(function (resolve, reject) {
    GetProducts(sequelizeObjects).then(products => {

      if (products.length === 0) {
        logger.log('No products specified on database!', logger.LOG_YELLOW);
      }

      // Handle products
      // noinspection JSIgnoredPromiseFromCall
      asyncForEach(products, async (productRaw) => {

        let product = productRaw.toJSON();

        if (product.product_code !== null) {

          // Get product page
          requestPromise(process.env.STORE_URL + product.product_code)
            .then(function (html) {


              let name = GetProductName(html);
              let price = GetProductPrice(html);


              if (product.product_name === null || product.original_price === null || product.current_price === null) {

                InsertOrUpdateProduct(sequelizeObjects, product.product_code, {
                  product_name: name,
                  original_price: price,
                  current_price: price,
                }).then(() => {

                  logger.log('Product ' + product.product_code + ' first time data update.', logger.LOG_DEFAULT)

                });

              } else {
                // Has complete data from first run
                const currentDbPrice = Number(product.current_price);
                if (price < currentDbPrice) {
                  InsertOrUpdateProduct(sequelizeObjects, product.product_code, {
                    current_price: price
                  }).then(() => {

                    email.SendEmail(process.env.STORE_URL + product.product_code, product.product_name, product.original_price, String(price));

                    logger.log('Product ' + product.product_code + ' entry update', logger.LOG_GREEN);

                  }).catch(error => {
                    reject(error);
                  });
                } else if (price > currentDbPrice) {
                  logger.log('Product ' + product.product_code + ' has got higher than original.', logger.LOG_DEFAULT)
                } else {
                  logger.log('Product ' + product.product_code + ' no change in price ' + price, logger.LOG_DEFAULT)
                }

              }

            }).catch(function (err) {
            console.log(err);
          });

        } else {
          logger.log('Error! no product code given for product id: ' + product.id + ' cannot check price.', logger.LOG_RED);
        }
      });

    }).catch(error => {
      reject(error);
    });
  });
};


// ---------------------------------------------------------------------------------------------------------------------

/**
 * Get all available products from product table
 * @param sequelizeObjects
 * @returns {Promise<any>}
 * @constructor
 */
function GetProducts(sequelizeObjects) {
  return new Promise(function (resolve, reject) {
    sequelizeObjects.Product.findAll()
      .then(products => {
        resolve(products);
      });
  });
}


/**
 * Get product name
 * @param {String} html
 * @returns {string}
 * @constructor
 */
function GetProductName(html) {
  let productName = '';
  $('.product-header-title', html).each(function (i, elem) {
    productName = String($(this).text());
  });
  return productName;
}


/**
 * Parse price from product html
 * @param {String} html
 * @constructor
 * @return {number}
 */
function GetProductPrice(html) {
  let price = 0.0;
  $('div .price-tag__price-tag-content', html).each(function (i, elem) {
    // console.log(String($('div > div', elem).text()));
    $('div > div', elem).each(function (i, elem) {
      if (i === 0) {
        price = Number(String($(this).text()).replace(',', '.'));
      }
    });
  });
  return price;
}


/**
 * Insert or update content
 * @param {Object} sequelizeObjects
 * @param {String} productCode
 * @param {Object} updateJson
 * @returns {Promise<any>}
 * @constructor
 */
function InsertOrUpdateProduct(sequelizeObjects, productCode, updateJson) {
  return new Promise(function (resolve, reject) {
    sequelizeObjects.Product.findAll({
      limit: 1,
      where: {
        product_code: productCode
      },
    }).then(obj => {
      if (obj.length > 0) {
        obj[0].update(
          updateJson
        ).then(() => {
          resolve();
        });
      } else {
        sequelizeObjects.Product.create(
          updateJson
        ).then(() => {
          resolve();
        }).catch(() => {
          reject();
        });
      }
    });
  });
}

// ---------------------------------------------------------------------------------------------------------------------
