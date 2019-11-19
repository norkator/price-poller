"use strict";
const nodemailer = require("nodemailer");
const dotenv = require('dotenv');
dotenv.config();


exports.SendEmail = function (productUrl, basePrice, newPrice) {
  main(productUrl, basePrice, newPrice)
    .catch(console.error);
};

async function main(productUrl, basePrice, newPrice) {
  console.log('Executing mail send');
  let transporter = nodemailer.createTransport({
    host: process.env.EMAIL_HOST, // hostname
    secureConnection: false, // TLS requires secureConnection to be false
    port: process.env.EMAIL_PORT, // port for secure SMTP
    tls: {
      ciphers: 'SSLv3'
    },
    auth: {
      user: process.env.EMAIL_USER,
      pass: process.env.EMAIL_PASSWORD
    }
  });
  // send mail with defined transport object
  let info = await transporter.sendMail({
    from: '"Price Poller" <' + process.env.EMAIL_USER + '>', // sender address
    to: process.env.EMAIL_TO_ADDRESS,
    subject: "Product price changed!", // Subject line
    text: productUrl + ' has new price ' + newPrice + ' base price was ' + basePrice, // plain text body
    // html: "<b>Hello world?</b>" // html body
  });
  console.log("Message sent: %s", info.messageId);
}
