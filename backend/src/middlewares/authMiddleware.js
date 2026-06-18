const jwt = require('jsonwebtoken');
const User = require('../models/User');
const AppError = require('../utils/AppError');
const env = require('../config/env');

const extractToken = (req) => {
  const authHeader = req.headers.authorization || '';
  if (authHeader.startsWith('Bearer ')) {
    return authHeader.split(' ')[1];
  }

  return req.cookies?.token || null;
};

const protect = async (req, res, next) => {
  const token = extractToken(req);

  if (!token) {
    return next(new AppError('Not authorized, no token provided.', 401));
  }

  try {
    const decoded = jwt.verify(token, env.jwtSecret);
    const user = await User.findById(decoded.id).select('-password');

    if (!user) {
      return next(new AppError('Not authorized, user not found.', 401));
    }

    req.user = user;
    return next();
  } catch (error) {
    return next(error);
  }
};

module.exports = {
  protect
};

