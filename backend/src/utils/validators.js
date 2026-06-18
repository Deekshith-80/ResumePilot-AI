const { body, param } = require('express-validator');

const strongPasswordMessage =
  'Password must be at least 8 characters and include upper, lower, number, and symbol.';

const registerValidation = [
  body('name').trim().notEmpty().withMessage('Name is required.'),
  body('email').trim().isEmail().withMessage('Please provide a valid email address.'),
  body('password')
    .isLength({ min: 8 })
    .withMessage(strongPasswordMessage)
    .matches(/[a-z]/)
    .withMessage(strongPasswordMessage)
    .matches(/[A-Z]/)
    .withMessage(strongPasswordMessage)
    .matches(/[0-9]/)
    .withMessage(strongPasswordMessage)
    .matches(/[^A-Za-z0-9]/)
    .withMessage(strongPasswordMessage),
  body('confirmPassword')
    .custom((value, { req }) => value === req.body.password)
    .withMessage('Passwords do not match.')
];

const loginValidation = [
  body('email').trim().isEmail().withMessage('Please provide a valid email address.'),
  body('password').notEmpty().withMessage('Password is required.')
];

const profileValidation = [
  body('name').optional().trim().notEmpty().withMessage('Name cannot be empty.'),
  body('email').optional().trim().isEmail().withMessage('Please provide a valid email address.'),
  body('phone').optional().trim().isLength({ min: 5 }).withMessage('Phone looks too short.'),
  body('location').optional().trim().isLength({ min: 2 }).withMessage('Location looks too short.'),
  body('bio').optional().trim().isLength({ max: 500 }).withMessage('Bio cannot exceed 500 characters.'),
  body('skills').optional()
];

const passwordValidation = [
  body('currentPassword').notEmpty().withMessage('Current password is required.'),
  body('newPassword')
    .isLength({ min: 8 })
    .withMessage(strongPasswordMessage)
    .matches(/[a-z]/)
    .withMessage(strongPasswordMessage)
    .matches(/[A-Z]/)
    .withMessage(strongPasswordMessage)
    .matches(/[0-9]/)
    .withMessage(strongPasswordMessage)
    .matches(/[^A-Za-z0-9]/)
    .withMessage(strongPasswordMessage)
];

const themeValidation = [
  body('theme').isIn(['light', 'dark', 'system']).withMessage('Theme must be light, dark, or system.')
];

const applicationValidation = [
  body('jobId').isMongoId().withMessage('A valid jobId is required.')
];

const atsValidation = [
  body('resumeId').optional().isMongoId().withMessage('resumeId must be a valid MongoDB id.'),
  body('jobDescription').optional().isString().withMessage('jobDescription must be text.'),
  body('targetRole').optional().isString().withMessage('targetRole must be text.')
];

const idValidation = [param('id').isMongoId().withMessage('Invalid resource id.')];

const validateRequest = (req, res, next) => {
  const { validationResult } = require('express-validator');
  const result = validationResult(req);

  if (!result.isEmpty()) {
    return res.status(400).json({
      success: false,
      message: 'Validation failed.',
      errors: result.array().map((error) => ({
        field: error.path,
        message: error.msg
      }))
    });
  }

  return next();
};

module.exports = {
  registerValidation,
  loginValidation,
  profileValidation,
  passwordValidation,
  themeValidation,
  applicationValidation,
  atsValidation,
  idValidation,
  validateRequest
};

