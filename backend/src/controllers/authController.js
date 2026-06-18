const User = require('../models/User');
const Resume = require('../models/Resume');
const ResumeVersion = require('../models/ResumeVersion');
const Application = require('../models/Application');
const generateToken = require('../utils/generateToken');
const AppError = require('../utils/AppError');
const asyncHandler = require('../utils/asyncHandler');
const env = require('../config/env');

const cookieOptions = (rememberMe = false) => ({
  httpOnly: true,
  secure: env.nodeEnv === 'production',
  sameSite: 'lax',
  maxAge: rememberMe ? 30 * 24 * 60 * 60 * 1000 : 7 * 24 * 60 * 60 * 1000
});

const getCurrentUser = asyncHandler(async (req, res) => {
  res.json({
    success: true,
    data: {
      user: req.user
    }
  });
});

const register = asyncHandler(async (req, res, next) => {
  const name = String(req.body.name || '').trim();
  const email = String(req.body.email || '').trim().toLowerCase();
  const { password, rememberMe } = req.body;

  const existingUser = await User.findOne({ email });
  if (existingUser) {
    return next(new AppError('An account with this email already exists.', 409));
  }

  const user = await User.create({
    name,
    email,
    password
  });

  const token = generateToken({ id: user._id });
  res.cookie('token', token, cookieOptions(Boolean(rememberMe)));

  res.status(201).json({
    success: true,
    message: 'Account created successfully.',
    data: {
      token,
      user
    }
  });
});

const login = asyncHandler(async (req, res, next) => {
  const { email, password, rememberMe } = req.body;

  const user = await User.findOne({ email: email.toLowerCase() }).select('+password');
  if (!user) {
    return next(new AppError('Invalid email or password.', 401));
  }

  const passwordMatches = await user.comparePassword(password);
  if (!passwordMatches) {
    return next(new AppError('Invalid email or password.', 401));
  }

  const safeUser = await User.findById(user._id);
  const token = generateToken({ id: user._id });
  res.cookie('token', token, cookieOptions(Boolean(rememberMe)));

  res.json({
    success: true,
    message: 'Logged in successfully.',
    data: {
      token,
      user: safeUser
    }
  });
});

const deleteAccount = asyncHandler(async (req, res) => {
  const userId = req.user._id;
  await Promise.all([
    Resume.deleteMany({ userId }),
    ResumeVersion.deleteMany({ userId }),
    Application.deleteMany({ userId }),
    User.findByIdAndDelete(userId)
  ]);

  res.clearCookie('token', {
    httpOnly: true,
    secure: env.nodeEnv === 'production',
    sameSite: 'lax'
  });

  res.json({
    success: true,
    message: 'Account deleted successfully.'
  });
});

const logout = asyncHandler(async (req, res) => {
  res.clearCookie('token', {
    httpOnly: true,
    secure: env.nodeEnv === 'production',
    sameSite: 'lax'
  });

  res.json({
    success: true,
    message: 'Logged out successfully.'
  });
});

module.exports = {
  register,
  login,
  getCurrentUser,
  deleteAccount,
  logout
};
