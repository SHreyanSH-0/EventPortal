const nodemailer = require('nodemailer');

const sendEmail = async ({ to, subject, html }) => {
  const port = Number(process.env.EMAIL_PORT) || 587;
  console.log(`[SMTP INFO] Attempting connection to ${process.env.EMAIL_HOST} on port ${port}...`);
  
  const transporter = nodemailer.createTransport({
    host: process.env.EMAIL_HOST,
    port: port,
    secure: port === 465, // true for 465, false for other ports
    auth: {
      user: process.env.EMAIL_USER,
      pass: process.env.EMAIL_PASS
    }
  });

  await transporter.sendMail({
    from: `"NIT-KKR Connect" <${process.env.EMAIL_FROM}>`,
    to,
    subject,
    html
  });
};

module.exports = sendEmail;
