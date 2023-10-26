const nodemailer = require('nodemailer');
const User = require('../models/User');

async function sendOTP(email) {
    try {
      const transporter = nodemailer.createTransport({
        service: 'Gmail',
        auth: {
          user: 'skafzalahmed143@gmail.com',
          pass: 'zvsanukjezyagqlu',
        },
      });
  
      const otp = Math.floor(100000 + Math.random() * 900000);
  
      // Email content
      const mailOptions = {
        from: 'skafzalahmed143@gmail.com',
        to: email,
        subject: 'Your OTP Code',
        text: `Your OTP code is: ${otp}`,
      };
  
      // Send the email
      await transporter.sendMail(mailOptions);
  
      // Update the user's OTP in the database
      const user = await User.findOne({
        where: { email },
      });
  
      if (user) {
        user.otp = otp;
        await user.save();
      }
  
      return otp; // Return the generated OTP
    } catch (error) {
      console.error(error);
      return null;
    }
  }
  
module.exports = {
  sendOTP,
};
