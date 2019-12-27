const nodemailer = require('nodemailer'); // https://community.nodemailer.com/
const Utils = require('./index');
const secret = require('../../config/secret.json');
const sgMail = require('@sendgrid/mail');

module.exports = {
  sendMail1: function (ops) {
    return _sendMail(ops);
  },
  
  sendMail: function (ops, callback) {
    const params = Utils.checkRequiredParams2(ops, ['to', 'subject']);
    if (params.error) {
      callback(params.error);
      return;
    }
    sendMail_By_SendGrid(params, callback);
    // sendMail_By_Google(params, callback)
  }
};

async function _sendMail(ops) {
  return new Promise(function (resolve, reject) {
    const params = Utils.checkRequiredParams2(ops, ['to', 'subject']);
    if (params.error) {
      reject(params.error);
      return;
    }
    sendMail_By_SendGrid(params, function (err, result) {
      // sendMail_By_Google(params, function(err, result) {
      if (err) {
        reject(err);
      } else {
        resolve(result);
      }
    })
  });
}

function sendMail_By_Google(params, callback) {
  to = params.to;
  subject = params.subject;
  text = params.text || '';
  html = params.html || '';
  
  const from = secret.mail_sender.user;
  // create reusable transporter object using the default SMTP transport
  let transporter = nodemailer.createTransport({
    host: secret.mail_sender.host,
    port: secret.mail_sender.port,
    secure: Number(secret.mail_sender.port) === 465, // true for 465, false for other ports
    auth: {
      user: from,
      pass: secret.mail_sender.password
    }
  });
  
  // setup email data with unicode symbols
  let mailOptions = {
    from: '"MQ Solutions"<' + from + '>', // sender address
    to: to,                 // list of receivers
    subject: subject,       // Subject line
    text: text,             // plain text body
    html: html              // html body
  };
  
  transporter.sendMail(mailOptions, (error, info) => {
    if (error) {
      callback(error);
      return;
    }
    callback(null);
  });
}

function sendMail_By_SendGrid(params, callback) {
  sgMail.setApiKey(secret.send_grid.api_key);
  const msg = {
    to: params.to,
    from: secret.send_grid.from,
    subject: params.subject,
    text: params.text || ''
  };
  if (params.html) {
    msg.html = params.html;
  }
  sgMail.send(msg, callback);
}
