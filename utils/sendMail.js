const nodemailer = require('nodemailer');


// async..await is not allowed in global scope, must use a wrapper
const sendMail = async (userEmail, username, resetToken, resetCode) => { 

  // create reusable transporter object using the default SMTP transport
  let transporter = nodemailer.createTransport({
    host: "smtp.gmail.com",
    port: 587,
    secure: false, // true for 465, false for other ports
    auth: {
      user: testAccount.user, // generated ethereal user
      pass: testAccount.pass, // generated ethereal password
    },

  });

  // send mail with defined transport object
  let info = await transporter.sendMail({
    from: '"Gospel View" <foo@example.com>', // sender address
    to: userEmail, // list of receivers
    subject: "Password Reset Request", // Subject line
    text: "Hello world?", // plain text body
    html: `<p>Hi ${username}</p>
           <p>You request to reset your password. Use the codes below to reset it. Expires in 10min</p> 
           <p>Reset Token ${resetToken}</p>
           <p>Reset Code ${resetCode}</p>
    `, // html body
  });

  console.log("Message sent: %s", info.messageId);
  // Message sent: <b658f8ca-6296-ccf4-8306-87d57a0b4321@example.com> 
}

module.exports = sendMail;