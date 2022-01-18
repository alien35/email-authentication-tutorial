const nodemailer = require("nodemailer");

const sendMail = async ({
  subject,
  to,
  html,
  text
}) => {
  let transporter = nodemailer.createTransport({
    service: 'gmail',
    auth: {
      user: 'YOURUSERNAME@gmail.com',
      pass: 'YOUR_PASSWORD' // naturally, replace both with your real credentials or an application-specific password
    }
  });
  return await transporter.sendMail({
    from: '"The Demo App Team" <foo@example.com>', // sender address
    to, // list of receivers
    subject, // Subject line
    text, // plain text body
    html, // html body
  });
}

module.exports = {
  sendMail
}
