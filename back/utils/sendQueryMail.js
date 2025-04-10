const nodemailer = require("nodemailer");
const sendQuery = (name,senderEmail,message)=>{
   const transporter = nodemailer.createTransport({
      host: process.env.MAIL_HOST,
      port: process.env.MAIL_PORT,
      secure: false, // true for 465, false for other ports
      auth: {
        user: process.env.MAIL_USER, // Email service username
        pass: process.env.MAIL_PASS, // Email service password
      },
    });

    const htmlContent = `Query By ${name} \n ${message}`


    const mailOptions = {
      from: senderEmail,
      to: "rahulbaliyan3333@gmail.com",
      subject: "Query",
      html: htmlContent, // HTML email
    };

    transporter.sendMail(mailOptions, (error, info) => {
      if (error) {
        console.log("Error sending email:", error);
      } else {
        console.log("Email sent successfully:", info.response);
      }
    });
}


module.exports = sendQuery
