import { Router } from "express";
import {
  createProduct,
  getProducts,
  getProductById,
  updateProduct,
  deleteProduct,
  addProductImages,
  removeProductImage,
  getPublicProducts,
  getPublicProductById,
  getPublicProductBySlug,
  getSearchSuggestions,
  getRelatedProducts,
} from "../controller/product.controller.js";
import { protect } from "../middleware/auth.middleware.js";
import { authorize } from "../middleware/role.middleware.js";
import upload from "../utils/multer.config.js";
import {
  validateCreateProduct,
  validateUpdateProduct,
  validateDeleteProduct,
  validateGetProduct,
} from "../validator/product.validator.js";

const router = Router();

// ============ PUBLIC ROUTES (No login required) ============

// 1. Search suggestions (most specific first)
router.get("/public/search-suggestions", getSearchSuggestions);

// 2. Related products
router.get("/public/related/:id", getRelatedProducts);

// 3. Get product by ID (specific ID route)
router.get("/public/id/:id", getPublicProductById);

// 4. Get product by Slug
router.get("/public/slug/:slug", getPublicProductBySlug);

// 5. Get all public products (least specific - comes last)
router.get("/public", getPublicProducts);

// ============ PROTECTED ROUTES (Login + Seller only) ============

router.use(protect);
router.use(authorize("seller"));

// Create product
router.post("/", upload.array("images", 5), validateCreateProduct, createProduct);

// Get seller's products
router.get("/", getProducts);

// Get single product (seller's own)
router.get("/:id", validateGetProduct, getProductById);

// Update product
router.put("/:id", upload.array("images", 5), validateUpdateProduct, updateProduct);

// Delete product
router.delete("/:id", validateDeleteProduct, deleteProduct);

// Add images to product
router.put("/:id/add-images", upload.array("images", 5), addProductImages);

// Remove image from product
router.delete("/:id/remove-image", removeProductImage);

export default router;