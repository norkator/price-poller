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

  poller.GetLatestPrice(sequelizeObjects).then(result => {
    console.log(result);
  }).catch(error => {
    console.log(error);
  });

  // Register scheduled tasks
  schedule.scheduleJob('* * 2 * * *', () => { // Every 2 hours
    poller.GetLatestPrice(sequelizeObjects).then(result => {
      console.log(result);
    }).catch(error => {
      console.log(error);
    });
  });


});
