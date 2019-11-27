'use strict';

// Components
const initDb = require('./module/database');
const schedule = require('node-schedule');
const poller = require('./app/poller');
const dotenv = require('dotenv');
dotenv.config();


// Run app
initDb.initDatabase().then(() => {
  let sequelizeObjects = require('./module/sequelize');

  poller.GetLatestPrices(sequelizeObjects).then(result => {
    console.log(result);
  }).catch(error => {
    console.log(error);
  });

  // Register scheduled tasks
  schedule.scheduleJob('* * 1 * * *', () => { // Every 1 hours
    poller.GetLatestPrices(sequelizeObjects).then(result => {
      console.log(result);
    }).catch(error => {
      console.log(error);
    });
  });


});
