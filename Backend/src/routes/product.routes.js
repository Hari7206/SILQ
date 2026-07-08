import { Router } from "express";
import {
  createProduct,
  getProducts,
  getProductById,
  updateProduct,
  deleteProduct,
  addProductImages,
  removeProductImage,
} from "../controller/product.controller.js";
import { protect } from "../middleware/auth.middleware.js";
import { authorize } from "../middleware/role.middleware.js";
import upload from "../utils/multer.config.js"; // ← Import multer

const router = Router();

// All product routes are protected and only for sellers
router.use(protect);
router.use(authorize("seller"));

// Product CRUD with image upload
router.post("/", upload.array("images", 5), createProduct); // ← Updated
router.get("/", getProducts);
router.get("/:id", getProductById);
router.put("/:id", updateProduct);
router.delete("/:id", deleteProduct);

// Image management
router.put("/:id/add-images", upload.array("images", 5), addProductImages);
router.delete("/:id/remove-image", removeProductImage);

export default router;