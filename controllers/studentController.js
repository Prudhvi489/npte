const Student = require('../models/Student');
const Group = require('../models/Group');
const responseHandler = require('../utils/responseHandler');
const nodemailer = require('nodemailer');
const multer = require('multer');
const path = require('path');
// Create a multer storage configuration for file uploads
const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, `./uploads/`);
  },
  filename: function (req, file, cb) {
    const extension = path.extname(file.originalname);
    const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1e9);
    cb(null, uniqueSuffix + extension); // Use a unique filename with original extension
  },
});

// Create a multer instance with the storage configuration
const upload = multer({ storage: storage });

async function createStudent(req, res) {
  try {
    const {
      email,
      name,
      phone,
      group,
      password,
      statusCode,
      
    } = req.body;

    // Check if an image file was uploaded
    const uploadPhoto = req.file ? req.file.filename : null;

    const groupExists = await Group.findOne({ where: { groupName: group } });
    if (!groupExists) {
      return responseHandler.badRequest(res, 'Group not available');
    }

    const student = await Student.create({
      email,
      name,
      phone,
      uploadPhoto, 
      group,
      password,
      statusCode,
      
    });

    responseHandler.created(res, 'Student created successfully', { student });
  } catch (error) {
    console.error(error);
    responseHandler.internalServerError(res, 'An error occurred');
  }
}

async function editStudent(req, res) {
  try {
    const { id } = req.params;
    const {
      email,
      name, 
      phone,
      group,
      password,
      statusCode,
    } = req.body;

    // Check if an image file was uploaded
    const uploadPhoto = req.file ? req.file.filename : null;

    const groupExists = await Group.findOne({ where: { groupName: group } });
    if (!groupExists) {
      return responseHandler.badRequest(res, 'Group not available');
    }

    const student = await Student.findByPk(id);
    if (!student) {
      return responseHandler.notFound(res, 'Student not found');
    }

    const updatedParams = {}; // Initialize an empty object to track updated parameters

    // Update specific fields based on the provided values
    if (email) {
      student.email = email;
      updatedParams.email = email; // Track the updated parameter
    }
    if (name) {
      student.name = name;
      updatedParams.name = name; // Track the updated parameter
    }
    if (phone) {
      student.phone = phone;
      updatedParams.phone = phone; // Track the updated parameter
    }
    if (uploadPhoto) {
      student.uploadPhoto = uploadPhoto;
      updatedParams.uploadPhoto = uploadPhoto; // Track the updated parameter
    }
    if (group) {
      student.group = group;
      updatedParams.group = group; // Track the updated parameter
    }
    if (password) {
      student.password = password;
      updatedParams.password = password; // Track the updated parameter
    }
    if (statusCode) {
      student.statusCode = statusCode;
      updatedParams.statusCode = statusCode; // Track the updated parameter
    }

    await student.save();

    responseHandler.success(res, 'Student updated successfully', { student, updatedParams });
  } catch (error) {
    console.error(error);
    responseHandler.internalServerError(res, 'An error occurred');
  }
}

async function deleteStudent(req, res) {
  try {
    const { id } = req.params;

    const student = await Student.findByPk(id);
    if (!student) {
      return responseHandler.notFound(res, 'Student not found');
    }

    await student.destroy();

    responseHandler.success(res, 'Student deleted successfully');
  } catch (error) {
    console.error(error);
    responseHandler.internalServerError(res, 'An error occurred');
  }
}

async function getAllStudentDetails(req, res) {
  try {
    const students = await Student.findAll({
      attributes: ['name', 'email', 'phone', 'group', 'registeredDate', 'statusCode'],
    });

    responseHandler.success(res, 'All student details', { students });
  } catch (error) {
    console.error(error);
    responseHandler.internalServerError(res, 'An error occurred');
  }
}

async function sendEmailToUser(req, res) {
  try {
    const { email, message } = req.body;

    const recipientEmails = email.split(',');

    const transporter = nodemailer.createTransport({
      service: 'Gmail',
      auth: {
        user: 'skafzalahmed143@gmail.com',
        pass: 'zvsanukjezyagqlu',
      },
    });

    const mailOptions = {
      from: 'skafzalahmed143@gmail.com',
      to: recipientEmails.join(','), // Combine recipient emails into a comma-separated string
      subject: 'Custom Subject',
      text: message,
    };

    transporter.sendMail(mailOptions, (error, info) => {
      if (error) {
        console.error(error);
        responseHandler.internalServerError(res, 'An error occurred while sending the email');
      } else {
        console.log('Email sent: ' + info.response);
        responseHandler.success(res, 'Email sent successfully');
      }
    });
  } catch (error) {
    console.error(error);
    responseHandler.internalServerError(res, 'An error occurred');
  }
}


module.exports = {
  createStudent,
  editStudent,
  deleteStudent,
  getAllStudentDetails,
  sendEmailToUser,
  
};













