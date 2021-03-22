const nodemailer = require("nodemailer");

const transporter = nodemailer.createTransport({
    host: process.env.MAILHOST,
    port: parseInt(process.env.MAILHOSTPORT),
    secure: true,
    auth: {
      user: process.env.MAILEREMAIL,
      pass: process.env.MAILERPASSWORD,
    }
  });

module.exports = transporter


// const sendWelcomeEmail = (email, name) => {
//     sgMail.send({
//         to: email,
//         from: 'paturkarr@gmail.com',
//         subject: 'Welcome To API Manager!',
//         text: `Hello ${name}! \nWelcome to The API Manager Application. It's not only the manager app but more of it. It's huge responsibility is on your shoulder. If your register here, It means that you have a lots of power in your hand and power comes with big responsibility. \n\nWe hope that you will never let us down!`
//     })
// }

// const sendGoodByeEmail = (email, name) => {
//     sgMail.send({
//         to: email,
//         from: 'paturkarr@gmail.com',
//         subject: `Good Bye, ${name}!`,
//         text: `Bye ${name}! \nThe responsibility given to you, you did it well. Thanks for your service. Hope we will meet soon. \nFor the security reason we are deleting all the api key generated by you!`
//     })
// }

// const sendOtp = (name, otpData) => {
//     sgMail.send({
//         to: otpData.email,
//         from: 'paturkarr@gmail.com',
//         subject: `Hello ${name} | OTP | noreply`,
//         text: `Hello ${name}\nYour OTP is ${otpData.otp}. Be quick, it will be expired on ${otpData.expiryDateTime.toLocaleString()}.\nThank You!`
//     })
// }

// module.exports = {
//     sendWelcomeEmail,
//     sendGoodByeEmail,
//     sendOtp
// }