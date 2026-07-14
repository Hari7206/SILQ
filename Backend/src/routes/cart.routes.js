import { Router } from "express";
import {
  addToCart,
  getCart,
  updateCartItem,
  removeCartItem,
} from "../controller/cart.controller.js";
import { protect } from "../middleware/auth.middleware.js";

const router = Router();

router.use(protect);

// Routes
router.post("/", addToCart);          
router.get("/", getCart);              
router.put("/:id", updateCartItem);   
router.delete("/:id", removeCartItem); 

export default router;