import cartModel from "../model/cart.model.js";
import productModel from "../model/product.model.js";
import orderModel from "../model/order.model.js";
import transactionModel from "../model/transaction.model.js";
import razorpay from "../config/razorpay.js";
import config from "../config/config.js";
import crypto from "crypto";

export const createOrder = async (req, res) => {
  try {
    const userId = req.user._id;
    const { address } = req.body;

    if (!address) {
      return res.status(400).json({
        success: false,
        message: "Please provide delivery address",
      });
    }

    const cartItems = await cartModel.aggregate([
      { $match: { user: userId } },
      {
        $lookup: {
          from: "products",
          localField: "product",
          foreignField: "_id",
          as: "productData",
        },
      },
      { $unwind: "$productData" },
      { $unwind: "$productData.variants" },
      {
        $match: {
          $expr: { $eq: ["$productData.variants._id", "$variant"] },
        },
      },
      {
        $addFields: {
          "currentPrice": "$productData.variants.price",
          "subtotal": {
            $multiply: ["$productData.variants.price.amount", "$quantity"],
          },
          "inStock": {
            $gte: ["$productData.variants.stock", "$quantity"],
          },
        },
      },
      {
        $group: {
          _id: null,
          items: {
            $push: {
              cartId: "$_id",
              product: "$productData._id",
              variant: "$variant",
              size: "$size",
              quantity: "$quantity",
              price: "$currentPrice",
              subtotal: "$subtotal",
              inStock: "$inStock",
            },
          },
          totalAmount: { $sum: "$subtotal" },
        },
      },
    ]);

    if (!cartItems || cartItems.length === 0) {
      return res.status(400).json({
        success: false,
        message: "Your cart is empty",
      });
    }

    const { items, totalAmount } = cartItems[0];

    const outOfStock = items.filter(item => !item.inStock);
    if (outOfStock.length > 0) {
      return res.status(400).json({
        success: false,
        message: "Some items are out of stock",
        outOfStock: outOfStock.map(item => item.product),
      });
    }

    const razorpayOrder = await razorpay.orders.create({
      amount: Math.round(totalAmount * 100),
      currency: "INR",
      receipt: `order_${Date.now()}`,
      notes: {
        userId: userId.toString(),
      },
    });
    const order = await orderModel.create({
      user: userId,
      items: items.map(item => ({
        product: item.product,
        variant: item.variant,
        size: item.size,
        quantity: item.quantity,
        price: item.price,
        subtotal: item.subtotal,
      })),
      subtotal: totalAmount,
      tax: 0,
      shipping: 0,
      discount: 0,
      totalAmount: totalAmount,
      status: "pending",
      razorpayOrderId: razorpayOrder.id,
      address: {
        fullname: address.fullname,
        phone: address.phone,
        addressLine1: address.addressLine1,
        addressLine2: address.addressLine2 || "",
        city: address.city,
        state: address.state,
        pincode: address.pincode,
        country: address.country || "India",
      },
      paymentMethod: "razorpay",
    });

    await transactionModel.create({
      orderId: order._id,
      razorpayOrderId: razorpayOrder.id,
      amount: totalAmount,
      currency: "INR",
      status: "created",
    });

    res.status(200).json({
      success: true,
      data: {
        orderId: order._id,
        razorpayOrderId: razorpayOrder.id,
        amount: totalAmount,
        currency: "INR",
        keyId: config.RAZORPAY_KEY_ID,
        items: items.map(item => ({
          product: item.product,
          variant: item.variant,
          size: item.size,
          quantity: item.quantity,
          price: item.price,
          subtotal: item.subtotal,
        })),
        address: address,
      },
    });

  } catch (error) {
    console.error("Create order error:", error);
    res.status(500).json({
      success: false,
      message: error.message || "Server error while creating order",
    });
  }
};

export const verifyPayment = async (req, res) => {
  try {
    const {
      razorpayOrderId,
      razorpayPaymentId,
      razorpaySignature,
      orderId,
    } = req.body;

    const userId = req.user._id;

    const order = await orderModel.findOne({
      _id: orderId,
      user: userId,
      razorpayOrderId: razorpayOrderId,
    });

    if (!order) {
      return res.status(404).json({
        success: false,
        message: "Order not found",
      });
    }

    const secret = config.RAZORPAY_KEY_SECRET;
    const generatedSignature = crypto
      .createHmac("sha256", secret)
      .update(`${razorpayOrderId}|${razorpayPaymentId}`)
      .digest("hex");

    if (generatedSignature !== razorpaySignature) {
      await transactionModel.findOneAndUpdate(
        { razorpayOrderId: razorpayOrderId },
        { status: "failed" }
      );

      return res.status(400).json({
        success: false,
        message: "Invalid payment signature",
      });
    }

    try {
      const payment = await razorpay.payments.fetch(razorpayPaymentId);
      
      if (payment.status !== "captured") {
        return res.status(400).json({
          success: false,
          message: `Payment status is ${payment.status}`,
        });
      }
    } catch (error) {
      console.error("Payment verification error:", error);
    }

    order.status = "paid";
    order.razorpayPaymentId = razorpayPaymentId;
    await order.save();

    await transactionModel.findOneAndUpdate(
      { razorpayOrderId: razorpayOrderId },
      {
        razorpayPaymentId: razorpayPaymentId,
        razorpaySignature: razorpaySignature,
        status: "success",
        response: {
          orderId: razorpayOrderId,
          paymentId: razorpayPaymentId,
          signature: razorpaySignature,
        },
      }
    );

    await cartModel.deleteMany({ user: userId });

    res.status(200).json({
      success: true,
      message: "Payment verified successfully",
      data: {
        orderId: order._id,
        razorpayOrderId: razorpayOrderId,
        razorpayPaymentId: razorpayPaymentId,
        totalAmount: order.totalAmount,
        status: order.status,
      },
    });

  } catch (error) {
    console.error("Verify payment error:", error);
    res.status(500).json({
      success: false,
      message: "Server error while verifying payment",
    });
  }
};