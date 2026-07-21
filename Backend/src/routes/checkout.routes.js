import { Router } from "express";
import { protect } from "../middleware/auth.middleware.js";
import { createOrder, verifyPayment } from "../controller/checkout.controller.js";
import {
  validateCreateOrder,
  validateVerifyPayment,
} from "../validator/checkout.validator.js";

const router = Router();

router.use(protect);

router.post("/create-order", validateCreateOrder, createOrder);
router.post("/verify-payment", validateVerifyPayment, verifyPayment);

export default router;