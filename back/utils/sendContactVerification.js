const nodemailer = require("nodemailer");

const sendContactVerification = async (
  contact,
  verifier,
  isPrimary,
  verificationToken
) => {
  const transporter = nodemailer.createTransport({
    host: process.env.MAIL_HOST,
    port: process.env.MAIL_PORT,
    secure: false,
    auth: {
      user: process.env.MAIL_USER,
      pass: process.env.MAIL_PASS,
    },
  });

  const verificationLink = `${process.env.APP_URL}/verify-contact-email?token=${verificationToken}&verifier=${verifier.email}&isPrimary=${isPrimary}`;

  const mailOptions = {
    from: process.env.MAIL_USER,
    to: contact.email,
    subject: "Verify Your Email for Contact",
    text: `Please click the link below to verify your email to become the contact for ${verifier.name} (${verifier.email}):\n\n${verificationLink}`,
  };

  await transporter.sendMail(mailOptions);
};

module.exports = sendContactVerification;
