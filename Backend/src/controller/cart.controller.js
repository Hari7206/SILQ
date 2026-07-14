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
      price: {
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



/**
 * Get all cart items for logged-in user
 * @route GET /api/cart
 * @access Private (Login required)
 */
export const getCart = async (req, res) => {
  try {
    const userId = req.user._id;

    const cartItems = await cartModel
      .find({ user: userId })
      .populate({
        path: "product",
        select: "title category images mainImage variants",
      })
      .sort({ createdAt: -1 }); 

    if (cartItems.length === 0) {
      return res.status(200).json({
        success: true,
        message: "Your cart is empty",
        cart: [],
        totalItems: 0,
        totalAmount: 0,
      });
    }

  const processedCart = cartItems.map((item) => {
  const variant = item.product.variants?.find(
    (v) => v._id.toString() === item.variant.toString()
  );


  const variantImages = variant?.images || [];
  const variantImage = variantImages[0] || item.product.mainImage || item.product.images?.[0];

  return {
    _id: item._id,
    product: {
      _id: item.product._id,
      title: item.product.title,
      category: item.product.category,
      mainImage: variantImage, // ← Use variant image!
    },
    variant: variant
      ? {
          _id: variant._id,
          color: variant.color,
          colorCode: variant.colorCode,
        }
      : null,
    size: item.size,
    quantity: item.quantity,
    price: item.price,
    subtotal: item.price.amount * item.quantity,
    inStock: variant ? variant.stock >= item.quantity : false,
  };
});
    const totalItems = processedCart.reduce((sum, item) => sum + item.quantity, 0);
    const totalAmount = processedCart.reduce((sum, item) => sum + item.subtotal, 0);

    res.status(200).json({
      success: true,
      message: "Cart fetched successfully",
      cart: processedCart,
      totalItems,
      totalAmount,
    });

  } catch (error) {
    console.error("Get cart error:", error);
    res.status(500).json({
      success: false,
      message: "Server error while fetching cart",
    });
  }
};



/**
 * Update cart item quantity
 * @route PUT /api/cart/:id
 * @access Private (Login required)
 */
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


/**
 * Remove item from cart
 * @route DELETE /api/cart/:id
 * @access Private (Login required)
 */
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