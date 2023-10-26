const bcrypt = require('bcrypt');
const User  = require('../models/User');
const emailUtils = require('../utils/emailUtils');

// helpers/userHelpers.js
const createUser = async (username, email, password, firstName, lastName) => {
  try {
    const hashedPassword = await bcrypt.hash(password, 10);
    const otp = await emailUtils.sendOTP(email);
    const user = await User.create({
      username,
      email,
      password: hashedPassword,
      firstName,
      lastName,
      otp,
    });
    return user;
  } catch (error) {
    throw error;
  }
};


async function findUserByEmail(email) {
const user = await User.findOne({ where: { email } });
return user;
}

async function getStoredOTP(email) {
  try {
    // Fetch the user record based on the provided email
    const user = await User.findOne({
      where: { email },
    });

    if (!user) {
      return null; // User not found
    }

    return user.otp; // Return the stored OTP for the user
  } catch (error) {
    console.error(error);
    throw error;
  }
}
async function updatePasswordByEmail(email, newPassword) {
  try {
    // Fetch the user record based on the provided email
    const user = await User.findOne({
      where: { email }
    });

    if (!user) {
      return false; // User not found
    }

    // Update the user's password
    user.password = newPassword;
    await user.save();

    return true; // Password updated successfully
  } catch (error) {
    console.error(error);
    throw error;
  }
}

module.exports = {
createUser,
findUserByEmail,
getStoredOTP,
updatePasswordByEmail
};


