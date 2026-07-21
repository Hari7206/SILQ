import mongoose from "mongoose";

const transactionSchema = new mongoose.Schema(
  {
    orderId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "order",
      required: true,
    },
    razorpayOrderId: {
      type: String,
      required: true,
  
    },
    razorpayPaymentId: {
      type: String,
      default: null,
    },
    razorpaySignature: {
      type: String,
      default: null,
    },
    amount: {
      type: Number,
      required: true,
      min: 0,
    },
    currency: {
      type: String,
      default: "INR",
    },
    status: {
      type: String,
      enum: ["created", "pending", "success", "failed"],
      default: "created",
    },
    response: {
      type: mongoose.Schema.Types.Mixed,
      default: null,
    },
    webhookPayload: {
      type: mongoose.Schema.Types.Mixed,
      default: null,
    },
  },
  {
    timestamps: true,
  }
);
transactionSchema.index({ razorpayOrderId: 1 });
transactionSchema.index({ orderId: 1 });

const transactionModel = mongoose.model("transaction", transactionSchema);

export default transactionModel;