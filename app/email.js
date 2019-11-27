"use strict";
const nodemailer = require("nodemailer");
const dotenv = require('dotenv');
dotenv.config();


exports.SendEmail = function (productUrlFull, productName, basePrice, newPrice) {
  main(productUrlFull, productName, basePrice, newPrice)
    .catch(console.error);
};

async function main(productUrlFull, productName, basePrice, newPrice) {
  console.log('Executing mail send');
  let transporter = nodemailer.createTransport({
    host: String(process.env.EMAIL_HOST), // hostname
    secureConnection: false, // TLS requires secureConnection to be false
    port: Number(process.env.EMAIL_PORT), // port for secure SMTP
    tls: {
      ciphers: 'SSLv3'
    },
    auth: {
      user: String(process.env.EMAIL_USER),
      pass: String(process.env.EMAIL_PASSWORD)
    }
  });
  // send mail with defined transport object
  let info = await transporter.sendMail({
    from: '"Price Poller" <' + String(process.env.EMAIL_USER) + '>', // sender address
    to: process.env.EMAIL_TO_ADDRESS,
    subject: productName + " price change to " + newPrice, // Subject line
    text: productUrlFull + ' has new price ' + newPrice + ' base price was ' + basePrice, // plain text body
    // html: "<b>Hello world?</b>" // html body
  });
  console.log("Message sent: %s", info.messageId);
}
