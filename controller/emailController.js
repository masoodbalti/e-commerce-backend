const nodemailer = require('nodemailer');
const asynchandler = require('express-async-handler');


const sendEmail = asynchandler(async(data, req, res)=>{
    const transporter = nodemailer.createTransport({
        host: "smtp.gmail.net",
        port: 465,
        secure: true,

        auth: {
          // TODO: replace `user` and `pass` values from <https://forwardemail.net>
          user: process.env.MAIL_Id,
          pass: process.env.MP,
        },
      });
      
      // async..await is not allowed in global scope, must use a wrapper
      // async function main() {
        // send mail with defined transport object
        let info = await transporter.sendMail({
          from: '"Hey 👻" <abc@example.com>', // sender address
          //  to: "data.to,             // list of receivers
          to: data.to,
          subject: data.subject, // Subject line
          text: data.text, // plain text body
          html: data.htm, // html body
        });
      
        console.log("Message sent: %s", info.messageId);
        console.log("Preview URL: %s", nodemailer.getTestMessageUrl(info));

    // }

});

module.exports = sendEmail;

