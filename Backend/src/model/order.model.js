import mongoose from "mongoose";

const addressSchema = new mongoose.Schema({
  fullname: { type: String, required: true },
  phone: { type: String, required: true },
  addressLine1: { type: String, required: true },
  addressLine2: { type: String },
  city: { type: String, required: true },
  state: { type: String, required: true },
  pincode: { type: String, required: true },
  country: { type: String, default: "India" },
});

const orderSchema = new mongoose.Schema(
  {
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "user",
      required: true,
    },
    
    items: {
      type: [
        {
          product: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "product",
            required: true,
          },
          variant: {
            type: mongoose.Schema.Types.ObjectId,
            required: true,
          },
          size: {
            type: String,
            required: true,
          },
          quantity: {
            type: Number,
            required: true,
            min: 1,
          },
          price: {
            amount: {
              type: Number,
              required: true,
            },
            currency: {
              type: String,
              default: "INR",
            },
          },
          subtotal: {
            type: Number,
            required: true,
          },
        },
      ],
      required: true,
    },

    subtotal: { type: Number, required: true, min: 0 },
    tax: { type: Number, default: 0, min: 0 },
    shipping: { type: Number, default: 0, min: 0 },
    discount: { type: Number, default: 0, min: 0 },
    totalAmount: { type: Number, required: true, min: 0 },

    status: {
      type: String,
      enum: ["pending", "paid", "processing", "shipped", "delivered", "cancelled", "failed"],
      default: "pending",
    },

    razorpayOrderId: { type: String, default: null },
    razorpayPaymentId: { type: String, default: null },

    address: {
      type: addressSchema,
      required: true,
    },

    paymentMethod: {
      type: String,
      enum: ["razorpay", "cod"],
      default: "razorpay",
    },

    statusHistory: [
      {
        status: {
          type: String,
          enum: ["pending", "paid", "processing", "shipped", "delivered", "cancelled", "failed"],
        },
        date: { type: Date, default: Date.now },
        note: { type: String },
      },
    ],
  },
  {
    timestamps: true,
  }
);

orderSchema.pre("save", function () {
  if (this.isModified("status")) {
    this.statusHistory.push({
      status: this.status,
      date: new Date(),
      note: `Order ${this.status}`,
    });
  }
});

orderSchema.virtual("isPaid").get(function () {
  return ["paid", "processing", "shipped", "delivered"].includes(this.status);
});

const orderModel = mongoose.model("order", orderSchema);

export default orderModel;