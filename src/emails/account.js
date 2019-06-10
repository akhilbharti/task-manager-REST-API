const sgMail = require("@sendgrid/mail");

sgMail.setApiKey(process.env.SENDGRID_API_KEY);

const sendWelcomeMail = (email, name) => {
  sgMail.send({
    to: email,
    from: "akhbharti@gmail.com",
    subject: "thanks for joining",
    text: `hi ${name}, welcome to the app and let me know how you like it.`
  });
};

const sendCancelMail = (email, name) => {
  sgMail.send({
    to: email,
    from: "akhbharti@gmail.com",
    subject: "cancelation mail",
    text: `hi ${name}, sorry for cancelation`
  });
};
module.exports = {
  sendWelcomeMail,
  sendCancelMail
};
