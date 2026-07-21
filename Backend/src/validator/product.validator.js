import { body, param } from "express-validator";
import { validateRequest } from "./auth.validator.js";

// Validate create product
export const validateCreateProduct = [
  body("title")
    .notEmpty()
    .withMessage("Title is required")
    .isLength({ min: 3 })
    .withMessage("Title must be at least 3 characters")
    .isLength({ max: 100 })
    .withMessage("Title must be under 100 characters"),

  body("description")
    .notEmpty()
    .withMessage("Description is required")
    .isLength({ min: 10 })
    .withMessage("Description must be at least 10 characters"),

  body("category")
    .notEmpty()
    .withMessage("Category is required")
    .isString()
    .withMessage("Category must be a string"),

  body("gender")
    .optional()
    .isIn(["Men", "Women", "Kids", "Unisex"])
    .withMessage("Invalid gender"),

  body("variants")
    .notEmpty()
    .withMessage("Variants are required")
    .isArray({ min: 1 })
    .withMessage("At least one variant is required"),

  body("variants.*.color")
    .notEmpty()
    .withMessage("Variant color is required"),

  body("variants.*.price.amount")
    .notEmpty()
    .withMessage("Variant price is required")
    .isNumeric()
    .withMessage("Price must be a number")
    .isFloat({ min: 0 })
    .withMessage("Price cannot be negative"),

  body("variants.*.stock")
    .notEmpty()
    .withMessage("Variant stock is required")
    .isNumeric()
    .withMessage("Stock must be a number")
    .isInt({ min: 0 })
    .withMessage("Stock cannot be negative"),

  validateRequest,
];

// Validate update product
export const validateUpdateProduct = [
  param("id")
    .isMongoId()
    .withMessage("Invalid product ID"),

  body("title")
    .optional()
    .isLength({ min: 3 })
    .withMessage("Title must be at least 3 characters")
    .isLength({ max: 100 })
    .withMessage("Title must be under 100 characters"),

  body("description")
    .optional()
    .isLength({ min: 10 })
    .withMessage("Description must be at least 10 characters"),

  body("category")
    .optional()
    .isString()
    .withMessage("Category must be a string"),

  body("gender")
    .optional()
    .isIn(["Men", "Women", "Kids", "Unisex"])
    .withMessage("Invalid gender"),

  body("variants")
    .optional()
    .isArray({ min: 1 })
    .withMessage("At least one variant is required"),

  body("variants.*.color")
    .optional()
    .notEmpty()
    .withMessage("Variant color is required"),

  body("variants.*.price.amount")
    .optional()
    .isNumeric()
    .withMessage("Price must be a number")
    .isFloat({ min: 0 })
    .withMessage("Price cannot be negative"),

  body("variants.*.stock")
    .optional()
    .isNumeric()
    .withMessage("Stock must be a number")
    .isInt({ min: 0 })
    .withMessage("Stock cannot be negative"),

  validateRequest,
];

// Validate delete product
export const validateDeleteProduct = [
  param("id")
    .isMongoId()
    .withMessage("Invalid product ID"),

  validateRequest,
];

// Validate get product by ID
export const validateGetProduct = [
  param("id")
    .isMongoId()
    .withMessage("Invalid product ID"),

  validateRequest,
];