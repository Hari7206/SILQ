import Razorpay from "razorpay";
import config from "./config.js";

if (!config.RAZORPAY_KEY_ID || !config.RAZORPAY_KEY_SECRET) {
  console.error(" Razorpay keys are missing! Please check your .env file.");
  console.error("   RAZORPAY_KEY_ID and RAZORPAY_KEY_SECRET are required.");
  process.exit(1); 
}

const razorpay = new Razorpay({
  key_id: config.RAZORPAY_KEY_ID,
  key_secret: config.RAZORPAY_KEY_SECRET,
});

console.log(" Razorpay initialized successfully");

export default razorpay;