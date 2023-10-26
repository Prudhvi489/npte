// authController.js
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const responseHandler = require('../utils/responseHandler');
const userHelpers = require('../helpers/userHelpers');
const config = require('../config/config');
const { sendOTP } = require('../utils/emailUtils');
const { ACCESS_TOKEN_SECRET, REFRESH_TOKEN_SECRET } = config;

// Function to generate an access token
function generateAccessToken(userId) {
  return jwt.sign({ id: userId }, ACCESS_TOKEN_SECRET, { expiresIn: '1h' });
}

// Function to generate a refresh token
function generateRefreshToken(userId) {
  return jwt.sign({ id: userId }, REFRESH_TOKEN_SECRET, { expiresIn: '7d' });
}

async function register(req, res) {
  try {
    const { username, email, password, firstName, lastName } = req.body;
    // Check if a user with the provided email already exists
    const existingUser = await userHelpers.findUserByEmail(email);
    if (existingUser) {
      return responseHandler.badRequest(res, 'Email already exists', { success: false });
    }
    // Create a new user
    const user = await userHelpers.createUser(username, email, password, firstName, lastName);
    if (user) {
      const accessToken = generateAccessToken(user.id);
      const refreshToken = generateRefreshToken(user.id);

      // Store the refresh token securely (e.g., in a database)
      // You can create a separate database table for storing refresh tokens

      responseHandler.created(res, 'User registered successfully', {
        success: true,
        token: accessToken,
        refreshToken,
        username,
        firstName,
        lastName,
      });
    } else {
      responseHandler.badRequest(res, 'User registration failed', { success: false });
    }
  } catch (error) {
    console.error(error);
    responseHandler.internalServerError(res, 'An error occurred');
  }
}


async function login(req, res) {
  try {
    const { email, password } = req.body;

    // Check if email and password are provided
    if (!email || !password) {
      return responseHandler.badRequest(res, 'Email and password are required', { success: false });
    }

    // Check if a user with the provided email exists
    const user = await userHelpers.findUserByEmail(email);

    if (!user) {
      return responseHandler.unauthorized(res, 'Email not found');
    }

    // Compare the password
    const isPasswordValid = await bcrypt.compare(password, user.password);

    if (!isPasswordValid) {
      return responseHandler.unauthorized(res, 'Invalid password');
    }

    // Include user information in the response
    const { id, username, firstName, lastName } = user;

    const accessToken = generateAccessToken(id);
    const refreshToken = generateRefreshToken(id);

    // Store the refresh token securely (e.g., in a database)

    responseHandler.success(res, 'User login successful', {
      token: accessToken,
      refreshToken: refreshToken,
      user: {
        id,
        email,
        username,
        firstName,
        lastName,
      },
    });
  } catch (error) {
    console.error(error);
    responseHandler.internalServerError(res, 'An error occurred');
  }
}


async function refreshToken(req, res) {
  try {
    const { refreshToken } = req.body;

    // Verify the refresh token
    jwt.verify(refreshToken, REFRESH_TOKEN_SECRET, (err, user) => {
      if (err) {
        return responseHandler.unauthorized(res, 'Invalid refresh token');
      }

      // Generate a new access token for the user
      const accessToken = generateAccessToken(user.id);

      // Send the new access token in the response
      responseHandler.success(res, 'Access token refreshed successfully', {
        token: accessToken,
      });
    });
  } catch (error) {
    console.error(error);
    responseHandler.internalServerError(res, 'An error occurred');
  }
}


async function forgotPassword(req, res) {
  try {
    const { email } = req.body;

    const user = await userHelpers.findUserByEmail(email);
    if (!user) {
      return responseHandler.badRequest(res, 'User not found');
    }

    const otp = await sendOTP(email);
    if (!otp) {
      return responseHandler.internalServerError(res, 'Failed to send OTP');
    }

    responseHandler.success(res, 'OTP sent successfully');
  } catch (error) {
    console.error(error);
    responseHandler.internalServerError(res, 'An error occurred');
  }
}

async function changePassword (req, res)  {
  try {
    const { email, otp, newPassword } = req.body;

    const storedOTP = await userHelpers.getStoredOTP(email);
    console.log(storedOTP);

    if (!storedOTP || storedOTP !== otp) {
      return responseHandler.badRequest(res, 'Invalid OTP');
    }

    const hashedPassword = await bcrypt.hash(newPassword, 10);

    const result = await userHelpers.updatePasswordByEmail(email, hashedPassword);

    if (result) {
      responseHandler.success(res, 'Password changed successfully');
    } else {
      responseHandler.badRequest(res, 'Password change failed');
    }
  } catch (error) {
    console.error(error);
    responseHandler.internalServerError(res, 'An error occurred');
  }
};

// authController.js

// ... Existing code ...

async function logout(req, res) {
  try {
    const { refreshToken } = req.body;

    
    const removed = await removeRefreshTokenFromDatabase(refreshToken);

    if (removed) {
      responseHandler.success(res, 'Logged out successfully');
    } else {
      responseHandler.badRequest(res, 'Logout failed');
    }
  } catch (error) {
    console.error(error);
    responseHandler.internalServerError(res, 'An error occurred');
  }
}


module.exports = {
  register,
  login,
  forgotPassword,
  changePassword,
  refreshToken,
  logout

};