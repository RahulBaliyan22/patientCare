const nodemailer = require("nodemailer");

const sendRecordsEmail = (email, records, sender) => {
  const transporter = nodemailer.createTransport({
    host: process.env.MAIL_HOST,
    port: process.env.MAIL_PORT,
    secure: false, // true for 465, false for other ports
    auth: {
      user: process.env.MAIL_USER, // Email service username
      pass: process.env.MAIL_PASS, // Email service password
    },
  });

  // Generate email HTML content
  const htmlContent = `
    <h1>Patient Medical Record</h1>
    <p><strong>Record shared by:</strong> ${sender.name}<br>
       <strong>Email:</strong> ${sender.email}<br>
       <strong>Phone:</strong> ${sender.phone || "Not provided"}<br>
       <strong>Age:</strong> ${
         sender.DOB
           ? new Date().getFullYear() - new Date(sender.DOB).getFullYear()
           : "Not provided"
       }</p>
      
       <p> Total Records Sent : ${records.length}</p>
    <hr>

    ${
      records.length > 0
        ? records
            .map(
              (record, idx) => `
        <div>
          <p><strong><u>Record Information ${idx + 1}:</u></strong></p>
          <p><strong>Date:</strong> ${new Date(
            record.date
          ).toLocaleDateString()}</p>
          <p><strong>Doctor:</strong> ${record.doctor || "Not provided"}</p>
          <p><strong>Diagnosis:</strong> ${
            record.diagnosis || "Not provided"
          }</p>
          <p><strong>Notes:</strong> ${
            record.notes || "No additional notes"
          }</p>

          <h3>Medical Images:</h3>
          ${
            record.image.length > 0
              ? record.image
                  .map(
                    (img) => `
              <div>
                <p><strong>${img.filename}</strong></p>
                <a href="${img.filePath}" download>Click here to download the image</a><br>
                <img src="${img.filePath}" alt="Medical Image" width="200px" style="margin-top: 10px;"/>
              </div>
            `
                  )
                  .join("")
              : `<p>No images available.</p>`
          }
        </div>
      `
            )
            .join("")
        : `<p>No records available.</p>`
    }

    <hr>

    <footer>
      <p><strong>For more information or inquiries, please contact us at:</strong></p>
      <p>Email: <a href="mailto:${sender.email}">${sender.email}</a><br>
      Phone: ${sender.phone || "Not provided"}<br>
      Address: ${sender.address || "Not provided"}</p>

      <strong>Thank you for using PatientCare. :)</strong>
    </footer>
  `;

  const mailOptions = {
    from: sender.email,
    to: email,
    subject: "Patient Record",
    html: htmlContent, // HTML-formatted email
  };

  transporter.sendMail(mailOptions, (error, info) => {
    if (error) {
      console.log("Error sending email:", error);
    } else {
      console.log("Email sent successfully:", info.response);
    }
  });
};

module.exports = sendRecordsEmail;
