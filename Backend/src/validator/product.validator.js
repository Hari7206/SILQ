// validator/product.validator.js
import { body, param } from "express-validator";
import { validateRequest } from "./auth.validator.js";

// Custom validator to check if field is array or valid JSON string
const isArrayOrJSONString = (value) => {
  if (Array.isArray(value)) return true;
  if (typeof value === 'string') {
    try {
      const parsed = JSON.parse(value);
      return Array.isArray(parsed);
    } catch {
      return false;
    }
  }
  return false;
};

// Custom validator to parse and validate variant data
const validateVariants = (value, { req }) => {
  let variants = value;
  
  // Parse if it's a string
  if (typeof value === 'string') {
    try {
      variants = JSON.parse(value);
    } catch {
      throw new Error('Variants must be a valid JSON array');
    }
  }
  
  // Check if it's an array
  if (!Array.isArray(variants) || variants.length === 0) {
    throw new Error('At least one variant is required');
  }
  
  // Validate each variant
  for (const [index, variant] of variants.entries()) {
    if (!variant.color) {
      throw new Error(`Variant at index ${index} is missing color`);
    }
    if (!variant.price?.amount) {
      throw new Error(`Variant at index ${index} is missing price amount`);
    }
    if (variant.stock === undefined || variant.stock === null) {
      throw new Error(`Variant at index ${index} is missing stock`);
    }
  }
  
  // Store parsed variants back to req.body for controller
  req.body.variants = variants;
  return true;
};

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

  // Use custom validator for variants
  body("variants")
    .notEmpty()
    .withMessage("Variants are required")
    .custom(validateVariants),

  // Handle weight as JSON string
  body("weight")
    .optional()
    .custom((value) => {
      if (typeof value === 'string') {
        try {
          const parsed = JSON.parse(value);
          if (typeof parsed === 'object' && parsed !== null) {
            return true;
          }
        } catch {}
      }
      return true; // Allow empty weight
    }),

  // Handle availableSizes as JSON string
  body("availableSizes")
    .optional()
    .custom((value) => {
      if (typeof value === 'string') {
        try {
          const parsed = JSON.parse(value);
          if (Array.isArray(parsed)) {
            return true;
          }
        } catch {}
      }
      return true; // Allow empty
    }),

  // Handle badges as JSON string
  body("badges")
    .optional()
    .custom((value) => {
      if (typeof value === 'string') {
        try {
          const parsed = JSON.parse(value);
          if (typeof parsed === 'object' && parsed !== null) {
            return true;
          }
        } catch {}
      }
      return true;
    }),

  validateRequest,
];

// Update similar for validateUpdateProduct
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
    .custom(validateVariants),

  // Add other JSON field handlers...

  validateRequest,
];

export const validateDeleteProduct = [
  param("id")
    .isMongoId()
    .withMessage("Invalid product ID"),
  validateRequest,
];

export const validateGetProduct = [
  param("id")
    .isMongoId()
    .withMessage("Invalid product ID"),
  validateRequest,
];