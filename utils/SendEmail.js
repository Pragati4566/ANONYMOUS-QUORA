const nodemailer = require("nodemailer");
const dotenv = require("dotenv");
dotenv.config();

module.exports = async (email, subject, text) => {
  try {
    const transporter = nodemailer.createTransport({ //configuration of the email server
      host: process.env.EMAIL_HOST, 
      service: process.env.EMAIL_SERVICE,
      port: process.env.EMAIL_PORT,
      secure: process.env.EMAIL_SECURE,
      auth: {
        user: process.env.EMAIL_USER,
        pass: process.env.EMAIL_PASS,
      },
    });

    await transporter.sendMail({
      from: process.env.EMAIL_USER,
      to: email,
      subject: subject,
      text: text,
    });
    console.log("Email sent successfully!");
  } catch (error) {
    console.log("Email not sent!");
    console.log(error);
    return error;
  }
};
//smtp gmail smtp port secure true or not //sender email //reciever mail as email
