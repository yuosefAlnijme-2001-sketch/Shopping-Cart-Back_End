const nodemailer = require('nodemailer')
// Nodemailer
const sendEmail = async options => {
  // 1) Create transporter ( service that will send email like "gmail","Mailgun", "mialtrap", sendGrid)
  const transporter = nodemailer.createTransport({
    // service: 'gmail',
    host: process.env.EMAIL_HOST, //smtp.gmail.com
    port: process.env.EMAIL_PORT, // if secure false port = 587, if true port= 465
    secure: true,
    // logger: true,
    // debug: true,
    // secureConnection: false,
    auth: {
      user: process.env.EMAIL_USER, // الاميل يلي بدو يوصل الرساله علية
      pass: process.env.EMAIL_PASSWORD, //الباسورد يلي بدو يوصل الرساله علية\
    },
    // tls: {
    //   rejectUnAuthorized: true,
    // },
  })
  // 2) Define email options (like from, to, subject, email content)
  const mailOpts = {
    from: 'E-shop App <yuosefalnijme07@gmail.com>',
    to: options.email,
    subject: options.subject,
    text: options.message,
  }
  // 3) Send email
  await transporter.sendMail(mailOpts)
}
module.exports = sendEmail
