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
  getSearchSuggestions ,
  getRelatedProducts
} from "../controller/product.controller.js";
import { protect } from "../middleware/auth.middleware.js";
import { authorize } from "../middleware/role.middleware.js";
import upload from "../utils/multer.config.js";

const router = Router();

router.get("/public/search-suggestions", getSearchSuggestions);
router.get("/public/related/:id", getRelatedProducts); 
router.get("/public", getPublicProducts);
router.get("/public/:id", getPublicProductById);

router.use(protect);
router.use(authorize("seller"));

router.post("/", upload.array("images", 5), createProduct);
router.get("/", getProducts);
router.get("/:id", getProductById);
router.put("/:id", upload.array("images", 5), updateProduct);
router.delete("/:id", deleteProduct);

router.put("/:id/add-images", upload.array("images", 5), addProductImages);
router.delete("/:id/remove-image", removeProductImage);

export default router;