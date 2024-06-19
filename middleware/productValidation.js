const { check, validationResult } = require("express-validator");

const validateProduct = [
  check('name')
    .trim()
    .isString().withMessage('Product name must be a string')
    .notEmpty().withMessage('Product name is required')
    .isLength({ min: 3 }).withMessage('Product name must be at least 3 characters long')
    .isLength({ max: 50 }).withMessage('Product name cannot be longer than 50 characters'),
  
  check('description')
    .isString().withMessage('Product description must be a string')
    .notEmpty().withMessage('Product description is required')
    .isLength({ min: 10 }).withMessage('Product description must be at least 10 characters long'),
  
  check('price')
    .isNumeric().withMessage('Product price must be a number')
    .notEmpty().withMessage('Product price is required')
    .isFloat({ min: 0 }).withMessage('Product price cannot be negative'),
  
  // check('categories')
  //   .isArray({ min: 1 }).withMessage('Product must belong to at least one category'),
    // .custom((categories, { req }) => {
    //   return categories.every(categoryId => mongoose.Types.ObjectId.isValid(categoryId));
    // }).withMessage('Invalid category ID format'),

  // check('subcategories')
  //   .optional()
  //   .isArray()
  //   .custom((subcategories, { req }) => {
  //     return subcategories.every(subcategoryId => mongoose.Types.ObjectId.isValid(subcategoryId));
  //   }).withMessage('Invalid subcategory ID format'),

  check('stockCount')
    .optional()
    .isInt({ min: 0, max: 300 }).withMessage('Stock count must be an integer between 0 and 300'),

  check('image')
    .notEmpty().withMessage('Choose an image'),
    // .isArray({ min: 1 }).withMessage('Product image is required'),

  // check('specifications')
  //   .optional()
  //   .isArray()
  //   .custom((specifications) => {
  //     return specifications.every(spec => 
  //       typeof spec.name === 'string' &&
  //       ['formFactor', 'pcieConnectors', 'sataConnectors', 'molexConnectors', 'warranty'].includes(spec.name) &&
  //       typeof spec.value === 'string'
  //     );
  //   }).withMessage('Invalid specifications format'),

  (req, res, next) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }
    next();
  }
];

module.exports = {validateProduct}
