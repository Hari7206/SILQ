
import { Router } from "express";
import { protect } from "../middleware/auth.middleware.js";
import { createOrder, verifyPayment } from "../controller/checkout.controller.js";

const router = Router();

router.use(protect);

router.post("/create-order", createOrder);
router.post("/verify-payment", verifyPayment);

export default router;