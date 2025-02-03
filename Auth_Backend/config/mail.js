const nodemailer = require("nodemailer");
require("dotenv").config();
const jwt = require("jsonwebtoken");

let transporter = nodemailer.createTransport({
  host: "smtp.gmail.com",
  port: 587,
  secure: false, 
  auth: {
    user: process.env.EMAIL,
    pass: process.env.PASSWORD,
  },
});

const sendWelcomeEmail = (email, username, ActivateToken) => {
  if (!email) {
    console.error("No email address provided.");
    return res.status(400).send("Email address is required.");
  }


  // Decode the token to extract the email
  const decodedToken = jwt.decode(ActivateToken, process.env.JWT_SECRET);
  console.log("Decoded token:", decodedToken);

  if (!decodedToken || !decodedToken.email) {
    return res.status(400).send("Invalid or expired token.");
  }

  // Construct the activation link
  const activationLink = `${process.env.Frontend}/verify/${ActivateToken}`;

  // Mail options
  let mailOptions = {
    from: process.env.EMAIL,
    to: email,
    subject: "Hello, Welcome to Our Service!",
    text: `Hello ${username}, thank you for signing up! We're excited to have you.`,
    html: `
      <b>Hello ${username},</b><br>
      <p>Thank you for signing up! We're excited to have you.</p>
      <p>Click the link below to activate your account:</p>
      <a href="${activationLink}">Activate your account</a>
    `,
  };

  // Send the email
  transporter.sendMail(mailOptions, (error, info) => {
    if (error) {
      console.log(error);
      return res.status(500).send("Error sending email");
    }
    console.log("Message sent: " + info.response);
  });
};


module.exports = sendWelcomeEmail;
