const nodemailer = require("nodemailer");

const forgotPassword = async (user, token) => {
  const transporter = nodemailer.createTransport({
    host: process.env.MAIL_HOST,
    port: process.env.MAIL_PORT,
    secure: false,
    auth: {
      user: process.env.MAIL_USER,
      pass: process.env.MAIL_PASS,
    },
  });

  // Send reset email
  const resetLink = `${process.env.REACT_APP_URL}/reset-password/${token}`;
  const mailOptions = {
    to: user.email,
    from: process.env.MAIL_USER,
    subject: "Password Reset",
    text: `You requested a password reset. Click the link below to reset your password:\n\n${resetLink}\n\nIf you didn't request this, please ignore this email.`,
  };

  await transporter.sendMail(mailOptions);
};

module.exports = forgotPassword;
