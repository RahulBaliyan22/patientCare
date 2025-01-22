const nodemailer = require("nodemailer");

const askContact = async (contact, verifier) => {
  const transporter = nodemailer.createTransport({
    host: process.env.MAIL_HOST,
    port: process.env.MAIL_PORT,
    secure: false,
    auth: {
      user: process.env.MAIL_USER,
      pass: process.env.MAIL_PASS,
    },
  });

  const mailOptions = {
    from: process.env.MAIL_USER,
    to: verifier,
    subject: `Contact Verified: ${contact.name}`,
    text: `The contact ${contact.name} (${contact.email}) has been verified and is now available for communication.`,
  };

  await transporter.sendMail(mailOptions);
};

module.exports = askContact;
