import productModel from "../model/product.model.js";



export const createProduct = async (req, res) => {
  try {
    // Get form-data fields
    const {
      title,
      description,
      priceAmount,
      priceCurrency,
      category,
      subCategory,
      availableSizes,
      colors,
      fabric,
      occasion,
      stock,
    } = req.body;

    // Check required fields
    if (!title || !description || !priceAmount || !category) {
      return res.status(400).json({
        success: false,
        message: "Please provide title, description, price, and category",
      });
    }

    // Check if images were uploaded
    if (!req.files || req.files.length === 0) {
      return res.status(400).json({
        success: false,
        message: "Please upload at least one image",
      });
    }

    // Process images from Cloudinary
    const images = req.files.map((file, index) => ({
      url: file.path,
      alt: req.body.altTexts?.[index] || `${title} - Image ${index + 1}`,
      isMain: index === 0, // First image is main
    }));

    // Parse arrays from form-data (they come as strings)
    const parsedSizes = availableSizes ? JSON.parse(availableSizes) : [];
    const parsedColors = colors ? JSON.parse(colors) : [];
    const parsedOccasion = occasion ? JSON.parse(occasion) : [];

    // Create product
    const product = await productModel.create({
      title,
      description,
      price: {
        amount: parseFloat(priceAmount),
        currency: priceCurrency || "INR",
      },
      category,
      subCategory: subCategory || null,
      images: images,
      availableSizes: parsedSizes,
      colors: parsedColors,
      fabric: fabric || null,
      occasion: parsedOccasion,
      stock: parseInt(stock) || 0,
      seller: req.user._id,
    });

    res.status(201).json({
      success: true,
      message: "Product created successfully",
      product,
    });
  } catch (error) {
    console.error("Create product error:", error);
    res.status(500).json({
      success: false,
      message: "Server error while creating product",
    });
  }
};




/**
 * Get all products for the logged-in seller
 * @route GET /api/products
 * @access Seller only
 */
export const getProducts = async (req, res) => {
  try {
    // Only products where seller = logged-in user
    const products = await productModel.find({ seller: req.user._id });

    res.status(200).json({
      success: true,
      count: products.length,
      products,
    });
  } catch (error) {
    console.error("Get products error:", error);
    res.status(500).json({
      success: false,
      message: "Server error while fetching products",
    });
  }
};









/**
 * Get single product by ID (only if seller owns it)
 * @route GET /api/products/:id
 * @access Seller only
 */








export const getProductById = async (req, res) => {
  try {
    const product = await productModel.findById(req.params.id);

    if (!product) {
      return res.status(404).json({
        success: false,
        message: "Product not found",
      });
    }

    // Check if seller owns this product
    if (product.seller.toString() !== req.user._id.toString()) {
      return res.status(403).json({
        success: false,
        message: "You are not authorized to view this product",
      });
    }

    res.status(200).json({
      success: true,
      product,
    });
  } catch (error) {
    console.error("Get product error:", error);
    res.status(500).json({
      success: false,
      message: "Server error while fetching product",
    });
  }
};











export const updateProduct = async (req, res) => {
  try {
    const product = await productModel.findById(req.params.id);

    if (!product) {
      return res.status(404).json({
        success: false,
        message: "Product not found",
      });
    }

    // Check if seller owns this product
    if (product.seller.toString() !== req.user._id.toString()) {
      return res.status(403).json({
        success: false,
        message: "You are not authorized to update this product",
      });
    }

    // req.body now has data because multer parsed FormData
    const {
      title,
      description,
      category,
      subCategory,
      fabric,
      stock,
      isActive,
    } = req.body;

    // Parse price if sent
    let price = product.price;
    if (req.body.priceAmount) {
      price = {
        amount: parseFloat(req.body.priceAmount),
        currency: req.body.priceCurrency || product.price.currency,
      };
    }

    // Parse arrays
    let availableSizes = product.availableSizes;
    if (req.body.availableSizes) {
      try {
        availableSizes = JSON.parse(req.body.availableSizes);
      } catch {
        availableSizes = req.body.availableSizes;
      }
    }

    let colors = product.colors;
    if (req.body.colors) {
      try {
        colors = JSON.parse(req.body.colors);
      } catch {
        colors = req.body.colors;
      }
    }

    let occasion = product.occasion;
    if (req.body.occasion) {
      try {
        occasion = JSON.parse(req.body.occasion);
      } catch {
        occasion = req.body.occasion;
      }
    }

    // Update only fields that are provided
    if (title) product.title = title;
    if (description) product.description = description;
    if (category) product.category = category;
    if (subCategory) product.subCategory = subCategory;
    if (fabric) product.fabric = fabric;
    if (stock !== undefined) product.stock = parseFloat(stock);
    if (isActive !== undefined) product.isActive = isActive === "true";
    if (price) product.price = price;
    if (availableSizes) product.availableSizes = availableSizes;
    if (colors) product.colors = colors;
    if (occasion) product.occasion = occasion;

    // Handle new images if uploaded
    if (req.files && req.files.length > 0) {
      const newImages = req.files.map((file, index) => ({
        url: file.path,
        alt: req.body.altTexts?.[index] || `${product.title} - Image ${index + 1}`,
        isMain: false,
      }));
      product.images = [...product.images, ...newImages];
    }

    await product.save();

    res.status(200).json({
      success: true,
      message: "Product updated successfully",
      product,
    });
  } catch (error) {
    console.error("Update product error:", error);
    res.status(500).json({
      success: false,
      message: "Server error while updating product",
    });
  }
};








/**
 * Add more images to existing product
 * @route PUT /api/products/:id/add-images
 * @access Seller only
 */
export const addProductImages = async (req, res) => {
  try {
    const product = await productModel.findById(req.params.id);

    if (!product) {
      return res.status(404).json({
        success: false,
        message: "Product not found",
      });
    }

    // Check if seller owns this product
    if (product.seller.toString() !== req.user._id.toString()) {
      return res.status(403).json({
        success: false,
        message: "You are not authorized to update this product",
      });
    }

    // Check if images were uploaded
    if (!req.files || req.files.length === 0) {
      return res.status(400).json({
        success: false,
        message: "Please upload at least one image",
      });
    }

    // Process new images
    const newImages = req.files.map((file, index) => ({
      url: file.path,
      alt: req.body.altTexts?.[index] || `Product image ${index + 1}`,
      isMain: false,
    }));

    // Add new images to existing images array
    product.images.push(...newImages);
    await product.save();

    res.status(200).json({
      success: true,
      message: "Images added successfully",
      product,
    });
  } catch (error) {
    console.error("Add images error:", error);
    res.status(500).json({
      success: false,
      message: "Server error while adding images",
    });
  }
};


/**
 * Remove an image from product
 * @route DELETE /api/products/:id/remove-image
 * @access Seller only
 */
export const removeProductImage = async (req, res) => {
  try {
    const product = await productModel.findById(req.params.id);

    if (!product) {
      return res.status(404).json({
        success: false,
        message: "Product not found",
      });
    }

    // Check if seller owns this product
    if (product.seller.toString() !== req.user._id.toString()) {
      return res.status(403).json({
        success: false,
        message: "You are not authorized to update this product",
      });
    }

    const { imageUrl } = req.body; // URL of image to remove

    if (!imageUrl) {
      return res.status(400).json({
        success: false,
        message: "Please provide image URL to remove",
      });
    }

    // Remove the image from array
    product.images = product.images.filter(
      (img) => img.url !== imageUrl
    );
    await product.save();

    res.status(200).json({
      success: true,
      message: "Image removed successfully",
      product,
    });
  } catch (error) {
    console.error("Remove image error:", error);
    res.status(500).json({
      success: false,
      message: "Server error while removing image",
    });
  }
};

// ... rest of your existing functions (getProducts, getProductById, updateProduct, deleteProduct)




/**
 * Delete product (only if seller owns it)
 * @route DELETE /api/products/:id
 * @access Seller only
 */
export const deleteProduct = async (req, res) => {
  try {
    const product = await productModel.findById(req.params.id);

    if (!product) {
      return res.status(404).json({
        success: false,
        message: "Product not found",
      });
    }

    // Check if seller owns this product
    if (product.seller.toString() !== req.user._id.toString()) {
      return res.status(403).json({
        success: false,
        message: "You are not authorized to delete this product",
      });
    }

    await product.deleteOne();

    res.status(200).json({
      success: true,
      message: "Product deleted successfully",
    });
  } catch (error) {
    console.error("Delete product error:", error);
    res.status(500).json({
      success: false,
      message: "Server error while deleting product",
    });
  }
};

/**
 * Get all public products (for home page)
 * @route GET /api/products/public
 * @access Public
 */
export const getPublicProducts = async (req, res) => {
  try {
    // Get only active products
    const products = await productModel
      .find({ isActive: true })
      .select("-__v") // Exclude version field
      .sort({ createdAt: -1 }) // Newest first
      .populate("seller", "fullname email"); // Get seller info

    res.status(200).json({
      success: true,
      count: products.length,
      products,
    });
  } catch (error) {
    console.error("Get public products error:", error);
    res.status(500).json({
      success: false,
      message: "Server error while fetching products",
    });
  }
};

/**
 * Get single public product by ID
 * @route GET /api/products/public/:id
 * @access Public
 */
export const getPublicProductById = async (req, res) => {
  try {
    const product = await productModel
      .findById(req.params.id)
      .select("-__v")
      .populate("seller", "fullname email");

    if (!product) {
      return res.status(404).json({
        success: false,
        message: "Product not found",
      });
    }

    // Check if product is active
    if (!product.isActive) {
      return res.status(404).json({
        success: false,
        message: "Product not available",
      });
    }

    res.status(200).json({
      success: true,
      product,
    });
  } catch (error) {
    console.error("Get public product error:", error);
    res.status(500).json({
      success: false,
      message: "Server error while fetching product",
    });
  }
};