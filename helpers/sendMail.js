const sgMail = require("@sendgrid/mail");
require("dotenv").config();

const { SENDGRID_API_KEY } = process.env;

sgMail.setApiKey(SENDGRID_API_KEY);

const sendMail = async (data) => {
  const mail = { ...data, from: "navamster@gmail.com" };

  sgMail
    .send(mail)
    .then(() => console.log("Mail sent successfully"))
    .catch((err) => console.log(err.message));
};

module.exports = sendMail;
