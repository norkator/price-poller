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
            requestPromise(GetStoreUrl(product.store_number) + product.product_code)
              .then(function (html) {

                // Parses name and price
                const productDetails = GetProductDetails(product.store_number, html);

                if (product.product_name === null || product.original_price === null || Number(product.original_price) === 0 || product.current_price === null || Number(product.current_price === 0)) {

                  InsertOrUpdateProduct(sequelizeObjects, product.product_code, {
                    product_name: productDetails.name,
                    original_price: productDetails.price,
                    current_price: productDetails.price,
                  }).then(() => {

                    logger.log('Product ' + product.product_code + ' first time data update.', logger.LOG_DEFAULT)

                  });

                } else {
                  // Has complete data from first run
                  const currentDbPrice = Number(product.current_price);
                  if (productDetails.price < currentDbPrice) {
                    InsertOrUpdateProduct(sequelizeObjects, product.product_code, {
                      current_price: productDetails.price
                    }).then(() => {

                      email.SendEmail(process.env.STORE_URL + product.product_code, product.product_name, product.original_price, String(productDetails.price));

                      logger.log('Product ' + product.product_code + ' entry update', logger.LOG_GREEN);

                    }).catch(error => {
                      reject(error);
                    });
                  } else if (productDetails.price > currentDbPrice) {
                    logger.log('Product ' + product.product_code + ' has got higher than original.', logger.LOG_DEFAULT)
                  } else {
                    logger.log('Product ' + product.product_code + ' no change in price ' + productDetails.price, logger.LOG_DEFAULT)
                  }

                }

              }).catch(function (err) {
              console.log(err);
            });

          }
          else {
            logger.log('Error! no product code given for product id: ' + product.id + ' cannot check price.', logger.LOG_RED);
          }
        });

      }
    ).catch(error => {
      reject(error);
    });
  });
};


// ---------------------------------------------------------------------------------------------------------------------


/**
 * Get store base url for number
 * @param {Number} storeNumber
 * @constructor
 * @return {string}
 */
function GetStoreUrl(storeNumber) {
  switch (storeNumber) {
    case 1:
      return process.env.STORE_URL;
    case 2:
      return process.env.STORE_URL_2;
    /* Add more here */
    default:
      return process.env.STORE_URL;
  }
}


/**
 * Get all available products from product table
 * @param sequelizeObjects
 * @returns {Promise<any>}
 * @constructor
 */
function GetProducts(sequelizeObjects) {
  return new Promise(function (resolve, reject) {
    sequelizeObjects.Product.findAll(
      {
        where: {
          enabled: 1
        }
      }
    )
      .then(products => {
        resolve(products);
      });
  });
}


/**
 * Parse price from product html
 * @param {Number} storeNumber
 * @param {String} html
 * @return {{name: string, price: number}}
 * @constructor
 */
function GetProductDetails(storeNumber, html) {
  let productDetails = {name: '', price: 0.0};
  switch (storeNumber) {
    case 1: // Verkkokauppa
      $('div .price-tag__price-tag-content', html).each(function (i, elem) {
        // console.log(String($('div > div', elem).text()));
        $('div > div', elem).each(function (i, elem) {
          if (i === 0) {
            productDetails.price = Number(String($(this).text()).replace(',', '.').replace(/[^0-9.]/g, ""));
          }
        });
      });
      $('.product-header-title', html).each(function (i, elem) {
        productDetails.name = String($(this).text());
      });
      break;
    case 2: // Sissos
      const productJson = JSON.parse(html);
      productDetails.name = productJson.name;
      productDetails.price = Number(productJson.price_info.price.with_tax);
      break;
    /* Add more here */
  }
  return productDetails;
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
