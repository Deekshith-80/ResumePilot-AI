const mongoose = require('mongoose');
const AppError = require('../utils/AppError');

const notFound = (req, res, next) => {
  next(new AppError(`Route not found: ${req.originalUrl}`, 404));
};

const errorHandler = (err, req, res, next) => {
  let error = err;

  if (!(error instanceof AppError)) {
    if (error.name === 'ValidationError') {
      error = new AppError('Validation error.', 400, Object.values(error.errors).map((fieldError) => fieldError.message));
    } else if (error.code === 11000) {
      const duplicateField = Object.keys(error.keyValue || {}).join(', ');
      error = new AppError(`Duplicate field value: ${duplicateField}`, 409);
    } else if (error.name === 'CastError' && error.kind === 'ObjectId') {
      error = new AppError('Invalid resource id.', 400);
    } else if (error.name === 'JsonWebTokenError') {
      error = new AppError('Invalid token. Please log in again.', 401);
    } else if (error.name === 'TokenExpiredError') {
      error = new AppError('Your token has expired. Please log in again.', 401);
    } else if (error.name === 'MulterError') {
      error = new AppError(error.message, 400);
    } else {
      error = new AppError(error.message || 'Internal server error.', error.statusCode || 500);
    }
  }

  const statusCode = error.statusCode || 500;
  const payload = {
    success: false,
    message: error.message || 'Internal server error.'
  };

  if (error.details) {
    payload.errors = error.details;
  }

  if (process.env.NODE_ENV !== 'production' && !(error instanceof mongoose.Error)) {
    payload.stack = error.stack;
  }

  res.status(statusCode).json(payload);
};

module.exports = {
  notFound,
  errorHandler
};

