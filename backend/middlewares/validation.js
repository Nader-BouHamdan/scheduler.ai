const { body, validationResult } = require('express-validator');

const validate = (req, res, next) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({ errors: errors.array() });
  }
  next();
};

const authValidation = {
  register: [
    body('email').isEmail().withMessage('Please enter a valid email'),
    body('password')
      .isLength({ min: 6 })
      .withMessage('Password must be at least 6 characters long'),
    body('name').notEmpty().withMessage('Name is required'),
    validate,
  ],
  login: [
    body('email').isEmail().withMessage('Please enter a valid email'),
    body('password').notEmpty().withMessage('Password is required'),
    validate,
  ],
};

const taskValidation = {
  create: [
    body('title').notEmpty().withMessage('Title is required'),
    body('description').optional(),
    body('dueDate').optional().isISO8601().withMessage('Invalid date format'),
    body('priority').optional().isIn(['low', 'medium', 'high']).withMessage('Invalid priority'),
    validate,
  ],
  update: [
    body('title').optional().notEmpty().withMessage('Title cannot be empty'),
    body('description').optional(),
    body('dueDate').optional().isISO8601().withMessage('Invalid date format'),
    body('priority').optional().isIn(['low', 'medium', 'high']).withMessage('Invalid priority'),
    validate,
  ],
};

module.exports = {
  authValidation,
  taskValidation,
}; 