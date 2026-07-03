import { body } from "express-validator";





import { validationResult } from "express-validator";

export const validateRequest = (req, res, next) => {
  const errors = validationResult(req);

  if (!errors.isEmpty()) {
    return res.status(400).json({
      success: false,
      errors: errors.array(),
    });
  }

  next();
};


export const validateRegisterUser = [
  body("fullname")
    .notEmpty()
    .withMessage("Full name is required")
    .isLength({ min: 3 })
    .withMessage("Full name must be at least 3 characters")
    .isLength({ max: 30 })
    .withMessage("Full name must be under 30 characters"),

  body("contact")
    .notEmpty()
    .withMessage("Contact number is required")
    .isLength({ min: 10, max: 15 })
    .withMessage("Contact must be valid")
    .isNumeric()
    .withMessage("Contact must contain only numbers")
    .matches(/^\+[1-9]\d{7,14}$/)
    .withMessage("Contact must contain only numbers"),

  body("email")
    .notEmpty()
    .withMessage("Email is required")
    .isEmail()
    .withMessage("Invalid email format"),

  body("password")
    .notEmpty()
    .withMessage("Password is required")
    .isLength({ min: 6 })
    .withMessage("Password must be at least 6 characters long"),

    body("isSeller")
    .isBoolean().withMessage("isSeller must be a boolean value") ,

    validateRequest
];


export const validateLoginUser = [
  body("email")
    .notEmpty()
    .withMessage("Email is required")
    .isEmail()
    .withMessage("Invalid email format"),

  body("password")
    .notEmpty()
    .withMessage("Password is required")
    .isLength({ min: 6 })
    .withMessage("Password must be at least 6 characters long"),

  validateRequest,
];
