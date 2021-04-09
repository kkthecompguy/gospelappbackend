const express = require('express');
const router = express.Router();
const { body, validationResult } = require('express-validator');
const User = require('../models/User');
const bcrypt = require('bcryptjs');
const validateEmail = require('../utils/validateemail');
const dotenv = require('dotenv');
const crypto = require('crypto');
const sendMail = require('../utils/sendMail');
const jwt = require('jsonwebtoken');
const { isAuthenticated } = require('../middleware/auth');

dotenv.config()


// @route /api/v1/users/login
// @desc login in user
// @access Public
router.post('/login',
 body('password', 'Password must be at least 6 character and at most 16 character').isLength({ min: 6, max: 16 }), 
 async (req, res) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) return res.status(400).json({ errors: errors.array(), status: 400 }); 
    const reqcontainsemail = validateEmail(req.body.emailphone);
    if (reqcontainsemail) { 
      const email = req.body.emailphone; 
      const user = await User.findOne({ email: email }); 
      if (!user) return res.status(400).json({ message: "Invalid credentials", status: 400 });
      const isMatch = await bcrypt.compare(req.body.password, user.password);
      if (!isMatch) return res.status(400).json({ message: "Invalid credentials", status: 400 });
      const payload = {
        id: user._id,
        status: user.status,
        role: user.role,
        isAdmin: user.isAdmin,
        email: user.email
      }
      jwt.sign(payload, process.env.JWT_SECRECT_KEY, {
        expiresIn: '1h'
      }, (error, token) => {
        if (error) {
          throw error;
        } else {
          return res.status(200).json({...payload, token: token, subscribed: user.subscribed});
        }
      });
    } else { 
      const phoneNumber = req.body.emailphone;
      const user = await User.findOne({ phoneNumber: phoneNumber });
      if (!user) return res.status(400).json({ message: "Invalid credentials", status: 400 });
      const isMatch = await bcrypt.compare(req.body.password, user.password);
      if (!isMatch) return res.status(400).json({ message: "Invalid credentials", status: 400 }); 
      const payload = {
        id: user._id,
        status: user.status,
        role: user.role,
        isAdmin: user.isAdmin,
        email: user.email,
      }
      jwt.sign(payload, process.env.JWT_SECRECT_KEY, {
        expiresIn: '1h'
      }, (error, token) => {
        if (error) {
          throw error;
        } else {
          return res.status(200).json({...payload, token: token,subscribed: user.subscribed});
        }
      });
    } 
  } catch (error) {
    console.log(error.message);
    res.status(500).json({ error: error.message, status: 500});
  }
});


// @route /api/v1/users/register
// @desc register user
// @access Public
router.post('/register',
 body('firstName', 'First Name is required').isString(), 
 body('lastName', 'Last Name is required').isString(),
 body('email', 'Please include valid email').isEmail(),
 body('phoneNumber', 'Please include valid phone number').isLength({ min: 10, max: 10 }),
 body('password', 'Password must be at least 6 characters and at most 16 characters').isLength({ min: 6, max: 16 }),
  async (req, res) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) return res.status(400).json({ errors: errors.array(), status: 400 });

    const userWithEmail = await User.findOne({ email: req.body.email });
    if (userWithEmail) return res.status(400).json({ message: "User with those account details already exist", status: 400 });

    const userWithPhone = await User.findOne({ phoneNumber: req.body.phoneNumber });
    if (userWithPhone)  return res.status(400).json({ message: "User with those account details already exist", status: 400 });

    const newUser = User({
      firstName: req.body.firstName,
      lastName: req.body.lastName,
      email: req.body.email,
      phoneNumber: req.body.phoneNumber,
      password: req.body.password
    });

    const salt = await bcrypt.genSalt(10);

    newUser.password = await bcrypt.hash(newUser.password, salt);

    await newUser.save();

    return res.status(201).json({ message:  "User successfully registered", status: 201 });
  } catch (error) {
    console.log(error.message);
    res.status(500).json({ error: error.message, status: 500});
  }
});


// @route /api/v1/users/forgotpassword
// @desc forgot password
// @access Public
router.post('/forgotpassword',
 body('email', 'Please include valid email').isEmail() , 
 async(req, res) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) return res.status(400).json({ errors: errors.array() }); 

    const user = await User.findOne({ email: req.body.email });
    if(!user) return res.status(404).json({ message: "User Not  Found", status: 404 });

    const resetToken = crypto.randomBytes(32).toString('hex');
    const resetCode  = (Math.floor(Math.random() * 10000) + 10000).toString().substring(1);
    
    const salt = await bcrypt.genSalt(10);
    const hashedToken = await bcrypt.hash(resetToken, salt);

    user.passwordResetToken = hashedToken;
    user.passwordExpiresTime = Date.now() + 10 * 60 * 1000;
    user.passwordResetCode = resetCode;

    console.log({resetToken, resetCode});

    await user.save();

    await sendMail(user.email, user.firstName, resetToken, resetCode);

    return res.status(200).json({ message: "Instructions on how to reset your password has been sent to your email", status: 200 });

  } catch (error) {
    console.log(error.message);
    res.status(500).json({ error: error.message, status: 500});
  }
});


// @route /api/v1/users/resetpassword
// @desc reset password
// @access Public
router.post('/resetpassword',
 body('resetToken', 'Reset Token  is required').isString(), 
 body('resetCode', 'Reset Code is required').isString(), 
 body('password',  'Password is required').isString(), 
 async(req, res) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) return res.status(400).json({ errors: errors.array(), status: 400 });

    const user = await User.findOne({ passwordResetCode: req.body.resetCode, passwordExpiresTime: {$gt: Date.now()} });
    if (!user) return res.status(400).json({ message: "Invalid Token or Token has expired", status: 400 });

    const isMatch = await bcrypt.compare(req.body.resetToken, user.passwordResetToken);
    if (!isMatch) return res.status(400).json({ message: "Invalid Token or Token has expired", status: 400 });

    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(req.body.password, salt);
    user.password = hashedPassword;
    user.passwordResetToken = undefined;
    user.passwordResetCode = undefined;
    user.passwordExpiresTime = undefined;

    await user.save();

    return res.status(200).json({ message: "Password changed successfully", status: 200 });
  } catch (error) {
    console.log(error.message);
    res.status(500).json({ error: error.message, status: 500});
  }
});


// @route /api/v1/users/all
// @desc get all users
// @access Public
router.get('/all', async(req, res) => {
  try {
    const users = await User.find();

    return res.status(200).json(users);
  } catch (error) {
    console.log(error.message);
    res.status(500).json({ error: error.message, status: 500});
  }
});


// @route /api/v1/users/profile
// @desc get user profile
// @access Private
router.get('/profile', isAuthenticated, async (req, res) => {
  try {
    console.log(req.user);
    const user = await User.findById(req.user.id).select('-password');
    if (!user) return res.status(404).json({ msg: 'User Not Found', status: 404 });
    return res.status(200).json(user);
  } catch (error) {
    console.log(error.message);
    return res.status(500).json({ error: error.message, status: 500});
  }
})


module.exports = router;