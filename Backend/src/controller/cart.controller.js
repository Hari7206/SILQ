import cartModel from "../model/cart.model.js";
import productModel from "../model/product.model.js";

export const addToCart = async (req, res) => {
  try {
    const { productId, variantId, size, quantity = 1 } = req.body;
    const userId = req.user._id;

    const product = await productModel.findById(productId);
    if (!product) {
      return res.status(404).json({
        success: false,
        message: "Product not found",
      });
    }

    const variant = product.variants.id(variantId);
    if (!variant) {
      return res.status(404).json({
        success: false,
        message: "Variant not found",
      });
    }

    if (variant.stock < quantity) {
      return res.status(400).json({
        success: false,
        message: `Only ${variant.stock} items available in stock`,
      });
    }

    let cartItem = await cartModel.findOne({
      user: userId,
      product: productId,
      variant: variantId,
      size: size,
    });

    if (cartItem) {
      const newQuantity = cartItem.quantity + quantity;
      if (variant.stock < newQuantity) {
        return res.status(400).json({
          success: false,
          message: `Only ${variant.stock} items available in stock`,
        });
      }
      cartItem.quantity = newQuantity;
      await cartItem.save();
      
      return res.status(200).json({
        success: true,
        message: "Cart updated successfully",
        cartItem,
      });
    }

    cartItem = await cartModel.create({
      user: userId,
      product: productId,
      variant: variantId,
      size: size,
      quantity: quantity,
      priceSnapshot: {
        amount: variant.price.amount,
        currency: variant.price.currency,
      },
    });

    res.status(201).json({
      success: true,
      message: "Item added to cart successfully",
      cartItem,
    });
  } catch (error) {
    console.error("Add to cart error:", error);
    res.status(500).json({
      success: false,
      message: "Server error while adding to cart",
    });
  }
};

export const getCart = async (req, res) => {
  try {
    const userId = req.user._id;

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
          "savings": {
            $subtract: ["$priceSnapshot.amount", "$productData.variants.price.amount"],
          },
          "hasSavings": {
            $gt: [
              { $subtract: ["$priceSnapshot.amount", "$productData.variants.price.amount"] },
              0
            ]
          }
        },
      },
      {
        $group: {
          _id: null,
          items: {
            $push: {
              _id: "$_id",
              user: "$user",
              product: {
                _id: "$productData._id",
                title: "$productData.title",
                category: "$productData.category",
                mainImage: "$productData.mainImage",
              },
              variant: {
                _id: "$productData.variants._id",
                color: "$productData.variants.color",
                colorCode: "$productData.variants.colorCode",
              },
              size: "$size",
              quantity: "$quantity",
              priceSnapshot: "$priceSnapshot",
              price: "$currentPrice",
              subtotal: "$subtotal",
              inStock: "$inStock",
              savings: "$savings",
              hasSavings: "$hasSavings",
            },
          },
          totalItems: { $sum: "$quantity" },
          totalAmount: { $sum: "$subtotal" },
          totalSavings: { $sum: "$savings" },
        },
      },
      {
        $project: {
          _id: 0,
          items: 1,
          totalItems: 1,
          totalAmount: 1,
          totalSavings: 1,
        },
      },
    ]);

    if (!cartItems || cartItems.length === 0) {
      return res.status(200).json({
        success: true,
        message: "Your cart is empty",
        cart: [],
        totalItems: 0,
        totalAmount: 0,
        totalSavings: 0,
      });
    }

    res.status(200).json({
      success: true,
      message: "Cart fetched successfully",
      cart: cartItems[0].items,
      totalItems: cartItems[0].totalItems,
      totalAmount: cartItems[0].totalAmount,
      totalSavings: cartItems[0].totalSavings || 0,
    });

  } catch (error) {
    console.error("Get cart error:", error);
    res.status(500).json({
      success: false,
      message: "Server error while fetching cart",
    });
  }
};

export const updateCartItem = async (req, res) => {
  try {
    const { id } = req.params;
    const { quantity } = req.body;
    const userId = req.user._id;

    if (!quantity || quantity < 1) {
      return res.status(400).json({
        success: false,
        message: "Quantity must be at least 1",
      });
    }

    const cartItem = await cartModel.findById(id);

    if (!cartItem) {
      return res.status(404).json({
        success: false,
        message: "Cart item not found",
      });
    }

    if (cartItem.user.toString() !== userId.toString()) {
      return res.status(403).json({
        success: false,
        message: "You are not authorized to update this cart item",
      });
    }
    const product = await productModel.findById(cartItem.product);
    if (!product) {
      return res.status(404).json({
        success: false,
        message: "Product not found",
      });
    }

    const variant = product.variants.id(cartItem.variant);
    if (!variant) {
      return res.status(404).json({
        success: false,
        message: "Variant not found",
      });
    }

    if (variant.stock < quantity) {
      return res.status(400).json({
        success: false,
        message: `Only ${variant.stock} items available in stock`,
      });
    }
    cartItem.quantity = quantity;
    await cartItem.save();

    const updatedCartItem = await cartModel
      .findById(id)
      .populate({
        path: "product",
        select: "title category images mainImage variants",
      });

    const variantDetails = updatedCartItem.product.variants?.find(
      (v) => v._id.toString() === updatedCartItem.variant.toString()
    );

    const response = {
      _id: updatedCartItem._id,
      product: {
        _id: updatedCartItem.product._id,
        title: updatedCartItem.product.title,
        category: updatedCartItem.product.category,
        mainImage: updatedCartItem.product.mainImage || updatedCartItem.product.images?.[0],
      },
      variant: variantDetails
        ? {
            _id: variantDetails._id,
            color: variantDetails.color,
            colorCode: variantDetails.colorCode,
          }
        : null,
      size: updatedCartItem.size,
      quantity: updatedCartItem.quantity,
      price: updatedCartItem.price,
      subtotal: updatedCartItem.price.amount * updatedCartItem.quantity,
      inStock: variantDetails ? variantDetails.stock >= updatedCartItem.quantity : false,
    };

    res.status(200).json({
      success: true,
      message: "Cart updated successfully",
      cartItem: response,
    });

  } catch (error) {
    console.error("Update cart error:", error);
    res.status(500).json({
      success: false,
      message: "Server error while updating cart",
    });
  }
};

export const removeCartItem = async (req, res) => {
  try {
    const { id } = req.params;
    const userId = req.user._id;

    const cartItem = await cartModel.findById(id);

    if (!cartItem) {
      return res.status(404).json({
        success: false,
        message: "Cart item not found",
      });
    }

    if (cartItem.user.toString() !== userId.toString()) {
      return res.status(403).json({
        success: false,
        message: "You are not authorized to remove this cart item",
      });
    }

    await cartItem.deleteOne();

    res.status(200).json({
      success: true,
      message: "Item removed from cart successfully",
    });

  } catch (error) {
    console.error("Remove cart error:", error);
    res.status(500).json({
      success: false,
      message: "Server error while removing item from cart",
    });
  }
};