const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken'); // Import the jsonwebtoken library
const config = require('../config/config');
const adminModel = require('../models/Admin');
const { ACCESS_TOKEN_SECRET, REFRESH_TOKEN_SECRET } = config;
const { Op } = require('sequelize');
const responseHandler = require('../utils/responseHandler');

// Admin Registration
async function registerAdmin(req, res) {
  try {
    const { email, password, username, adminName, mobile } = req.body;

    // Validate fields (you can use a validation library like Joi)
    if (!email || !password || !username || !adminName || !mobile) {
      return res.status(400).json({ status: 1, message: 'All fields are required' });
    }

    // Check if the admin already exists
    const existingAdmin = await adminModel.findOne({ email });
    if (existingAdmin) {
      return res.status(409).json({ status: 0, message: 'Admin already exists' });
    }

    // Hash the password before storing it
    const hashedPassword = await bcrypt.hash(password, 10);

    // Create a new admin
    const newAdmin = new adminModel({
      email,
      password: hashedPassword,
      username,
      adminName,
      mobile,
    });

    await newAdmin.save();

    res.status(201).json({ message: 'Admin registered successfully' });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'An error occurred' });
  }
}
// Admin Login
async function loginAdmin(req, res) {
    try {
      const { email, password } = req.body;
  
      // Validate fields (you can use a validation library like Joi)
      if (!email || !password) {
        return res.status(400).json({ status: 0, message: 'Email and password are required' });
      }
  
      // Find the admin by email
      const admin = await adminModel.findOne({ email });
  
      if (!admin) {
        return res.status(401).json({ status: 0, message: 'Invalid credentials' });
      }
  
      // Compare the provided password with the stored hashed password
      const isPasswordValid = await bcrypt.compare(password, admin.password);
  
      if (!isPasswordValid) {
        return res.status(401).json({ status: 0, message: 'Invalid credentials' });
      }
  
      // Create an access token
      const accessToken = jwt.sign({ adminId: admin._id }, ACCESS_TOKEN_SECRET, { expiresIn: '1h' });
      console.log(accessToken); // Log the generated token to the console
      
  
      // Create a refresh token
      const refreshToken = jwt.sign({ adminId: admin._id },  REFRESH_TOKEN_SECRET  ,{ expiresIn: '7d' });
  
      res.json({ status: 1, message: 'Login Successful', accessToken, refreshToken });
    } catch (error) {
      console.error(error);
      res.status(500).json({ status: 0, message: 'An error occurred' });
    }
  }

async function getAdminDetails(req, res) {
    try {
      const adminDetails = await adminModel.findAll({
        attributes: ['id', 'email', 'username', 'adminName', 'mobile' ],
      });
  
      responseHandler.success(res, 'AdminDetails:',  {adminDetails} );
    } catch (error) {
      console.error(error);
      responseHandler.internalServerError(res, 'An error occurred');
    }
}
// Update Password 
async function updatePassword(req, res) {
try {
    const { oldPassword, newPassword } = req.body;
    // Retrieve the admin ID from the access token
    const token = req.headers.authorization;
    if (!token) {
    return res.status(401).json({ status: 0, message: 'Authorization token not provided' });
    }
    const tokenPayload = jwt.verify(token, ACCESS_TOKEN_SECRET);
    console.log(tokenPayload);

    const adminId = tokenPayload.id;
    console.log(adminId);

    // Find the admin by ID using Sequelize's findByPk 
    const admin = await adminModel.findByPk(adminId);

    if (!admin) {
    return res.status(404).json({ status: 0, message: 'Admin not found' });
    }

    // Compare the provided old password with the stored hashed password
    const isPasswordValid = await bcrypt.compare(oldPassword, admin.password);

    if (!isPasswordValid) {
    return res.status(401).json({ status: 0, message: 'Incorrect old password' });
    }

    // Hash the new password before updating it
    const hashedNewPassword = await bcrypt.hash(newPassword, 10);

    // Update the password
    admin.password = hashedNewPassword;
    await admin.save();

    res.json({ status: 1, message: 'Password updated successfully' });
} catch (error) {
    console.error(error);
    res.status(500).json({ status: 0, message: 'An error occurred' });
}
}

module.exports = {
  registerAdmin,
  loginAdmin,
  getAdminDetails,
  updatePassword
};
