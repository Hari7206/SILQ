import { body } from "express-validator";
import { validateRequest } from "./auth.validator.js";





export const validateCreateOrder = [
  body("address")
    .notEmpty()
    .withMessage("Address is required")
    .isObject()
    .withMessage("Address must be an object"),

  body("address.fullname")
    .notEmpty()
    .withMessage("Full name is required")
    .isLength({ min: 3 })
    .withMessage("Full name must be at least 3 characters")
    .isLength({ max: 50 })
    .withMessage("Full name must be under 50 characters"),

  body("address.phone")
    .notEmpty()
    .withMessage("Phone number is required")
    .isLength({ min: 10, max: 15 })
    .withMessage("Phone number must be valid")
    .matches(/^[0-9]{10,15}$/)
    .withMessage("Phone number must contain only numbers"),

  body("address.addressLine1")
    .notEmpty()
    .withMessage("Address line 1 is required")
    .isLength({ min: 3 })
    .withMessage("Address must be at least 3 characters")
    .isLength({ max: 100 })
    .withMessage("Address must be under 100 characters"),

  body("address.addressLine2")
    .optional()
    .isLength({ max: 100 })
    .withMessage("Address line 2 must be under 100 characters"),

  body("address.city")
    .notEmpty()
    .withMessage("City is required")
    .isLength({ min: 2 })
    .withMessage("City must be at least 2 characters")
    .isLength({ max: 50 })
    .withMessage("City must be under 50 characters"),

  body("address.state")
    .notEmpty()
    .withMessage("State is required")
    .isLength({ min: 2 })
    .withMessage("State must be at least 2 characters")
    .isLength({ max: 50 })
    .withMessage("State must be under 50 characters"),

  body("address.pincode")
    .notEmpty()
    .withMessage("Pincode is required")
    .isLength({ min: 6, max: 6 })
    .withMessage("Pincode must be 6 digits")
    .matches(/^[0-9]{6}$/)
    .withMessage("Pincode must contain only numbers"),

  body("address.country")
    .optional()
    .isLength({ max: 50 })
    .withMessage("Country must be under 50 characters"),

  validateRequest,
];

export const validateVerifyPayment = [
  body("razorpayOrderId")
    .notEmpty()
    .withMessage("Razorpay order ID is required")
    .isString()
    .withMessage("Invalid razorpay order ID"),

  body("razorpayPaymentId")
    .notEmpty()
    .withMessage("Razorpay payment ID is required")
    .isString()
    .withMessage("Invalid razorpay payment ID"),

  body("razorpaySignature")
    .notEmpty()
    .withMessage("Razorpay signature is required")
    .isString()
    .withMessage("Invalid signature"),

  body("orderId")
    .notEmpty()
    .withMessage("Order ID is required")
    .isMongoId()
    .withMessage("Invalid order ID"),

  validateRequest,
];