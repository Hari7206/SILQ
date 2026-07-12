import { Router } from "express";
import {
  createProduct,
  getProducts,
  getProductById,
  updateProduct,
  deleteProduct,
  addProductImages,
  removeProductImage,
<<<<<<< HEAD
   getPublicProducts,     
  getPublicProductById,
=======
  getPublicProducts,      // ← NEW
  getPublicProductById,   // ← NEW
>>>>>>> 82f10fe (varient added)
} from "../controller/product.controller.js";
import { protect } from "../middleware/auth.middleware.js";
import { authorize } from "../middleware/role.middleware.js";
import upload from "../utils/multer.config.js";

const router = Router();

<<<<<<< HEAD

router.get("/public", getPublicProducts);           
router.get("/public/:id", getPublicProductById);  
=======
// ============ PUBLIC ROUTES (No login required) ============
router.get("/public", getPublicProducts);
router.get("/public/:id", getPublicProductById);

// ============ PROTECTED ROUTES (Login + Seller only) ============
>>>>>>> 82f10fe (varient added)
router.use(protect);
router.use(authorize("seller"));

router.post("/", upload.array("images", 5), createProduct);
router.get("/", getProducts);
router.get("/:id", getProductById);
<<<<<<< HEAD
router.put("/:id", upload.array("images", 5), updateProduct); 
=======
router.put("/:id", upload.array("images", 5), updateProduct);
>>>>>>> 82f10fe (varient added)
router.delete("/:id", deleteProduct);

router.put("/:id/add-images", upload.array("images", 5), addProductImages);
router.delete("/:id/remove-image", removeProductImage);



 

export default router;