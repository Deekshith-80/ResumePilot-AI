const User = require('../models/User');
const asyncHandler = require('../utils/asyncHandler');
const AppError = require('../utils/AppError');
const env = require('../config/env');

const updateTheme = asyncHandler(async (req, res) => {
  const { theme } = req.body;
  const user = await User.findByIdAndUpdate(
    req.user._id,
    { theme },
    {
      new: true,
      runValidators: true
    }
  );

  res.json({
    success: true,
    message: 'Theme updated successfully.',
    data: {
      user
    }
  });
});

const updatePassword = asyncHandler(async (req, res, next) => {
  const { currentPassword, newPassword } = req.body;
  const user = await User.findById(req.user._id).select('+password');

  const valid = await user.comparePassword(currentPassword);
  if (!valid) {
    return next(new AppError('Current password is incorrect.', 401));
  }

  user.password = newPassword;
  await user.save();

  res.clearCookie('token', {
    httpOnly: true,
    secure: env.nodeEnv === 'production',
    sameSite: 'lax'
  });

  res.json({
    success: true,
    message: 'Password updated successfully. Please log in again.'
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
  updateTheme,
  updatePassword,
  logout
};

