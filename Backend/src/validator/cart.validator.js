import { body, param } from "express-validator";
import { validateRequest } from "./auth.validator.js";

export const validateAddToCart = [
  body("productId")
    .notEmpty()
    .withMessage("Product ID is required")
    .isMongoId()
    .withMessage("Invalid product ID"),

  body("variantId")
    .notEmpty()
    .withMessage("Variant ID is required")
    .isMongoId()
    .withMessage("Invalid variant ID"),

  body("size")
    .notEmpty()
    .withMessage("Size is required")
    .isString()
    .withMessage("Size must be a string")
    .isIn(["XS", "S", "M", "L", "XL", "XXL"])
    .withMessage("Invalid size"),

  body("quantity")
    .optional()
    .isInt({ min: 1 })
    .withMessage("Quantity must be at least 1")
    .toInt(),

  validateRequest,
];

export const validateUpdateCartItem = [
  param("id")
    .isMongoId()
    .withMessage("Invalid cart item ID"),

  body("quantity")
    .notEmpty()
    .withMessage("Quantity is required")
    .isInt({ min: 1 })
    .withMessage("Quantity must be at least 1")
    .toInt(),

  validateRequest,
];

export const validateRemoveCartItem = [
  param("id")
    .isMongoId()
    .withMessage("Invalid cart item ID"),

  validateRequest,
];