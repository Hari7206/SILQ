import { Router } from "express";
import {
  addToCart,
  getCart,
  updateCartItem,
  removeCartItem,
} from "../controller/cart.controller.js";
import { protect } from "../middleware/auth.middleware.js";
import {
  validateAddToCart,
  validateUpdateCartItem,
  validateRemoveCartItem,
} from "../validator/cart.validator.js";

const router = Router();

router.use(protect);

router.post("/", validateAddToCart, addToCart);
router.get("/", getCart);
router.put("/:id", validateUpdateCartItem, updateCartItem);
router.delete("/:id", validateRemoveCartItem, removeCartItem);

export default router;