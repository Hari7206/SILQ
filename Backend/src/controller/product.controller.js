import productModel from "../model/product.model.js";

export const createProduct = async (req, res) => {
  try {
    const {
      title,
      description,
      category,
      subCategory,
      variants,
      availableSizes,
      fabric,
      occasion,
      badges,
      isActive,
      isFeatured,
    } = req.body;

    // Check required fields
    if (!title || !description || !category) {
      return res.status(400).json({
        success: false,
        message: "Please provide title, description, and category",
      });
    }

    // Parse variants
    let parsedVariants = variants;
    if (typeof variants === "string") {
      try {
        parsedVariants = JSON.parse(variants);
      } catch {
        return res.status(400).json({
          success: false,
          message: "Invalid variants format",
        });
      }
    }

    if (!parsedVariants || parsedVariants.length === 0) {
      return res.status(400).json({
        success: false,
        message: "Please add at least one variant",
      });
    }

    // Distribute images to ALL variants
    if (req.files && req.files.length > 0) {
      const uploadedUrls = req.files.map((file) => file.path);
      
      parsedVariants.forEach((variant, index) => {
        if (uploadedUrls[index]) {
          variant.images = [uploadedUrls[index]];
        }
      });
    }

    // Validate variants
    for (const variant of parsedVariants) {
      if (!variant.color || !variant.price?.amount || variant.stock === undefined) {
        return res.status(400).json({
          success: false,
          message: "Each variant must have color, price, and stock",
        });
      }
    }

    // Parse availableSizes
    let parsedSizes = availableSizes;
    if (typeof availableSizes === "string") {
      try {
        parsedSizes = JSON.parse(availableSizes);
        if (!Array.isArray(parsedSizes)) {
          parsedSizes = [];
        }
      } catch {
        parsedSizes = [];
      }
    }

    // Parse badges
    let parsedBadges = badges || {};
    if (typeof badges === "string") {
      try {
        parsedBadges = JSON.parse(badges);
      } catch {
        parsedBadges = {};
      }
    }

    // Get main image (first variant's first image)
    const mainImage = parsedVariants[0]?.images?.[0] || null;

    // Remove SKU if empty to avoid duplicate error
    const cleanedVariants = parsedVariants.map((v) => ({
      ...v,
      sku: v.sku || undefined,
    }));

    // Create product
    const product = await productModel.create({
      title,
      description,
      category,
      subCategory: subCategory || null,
      mainImage,
      variants: cleanedVariants,
      availableSizes: parsedSizes || [],
      fabric: fabric || null,
      occasion: occasion || [],
      badges: parsedBadges,
      isActive: isActive !== undefined ? isActive : true,
      isFeatured: isFeatured || false,
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
      message: error.message || "Server error while creating product",
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
    const products = await productModel.find({ seller: req.user._id });

  
    const productsWithVirtuals = products.map((p) => ({
      ...p.toObject(),
      priceRange: p.priceRange,
      totalStock: p.totalStock,
    }));

    res.status(200).json({
      success: true,
      count: productsWithVirtuals.length,
      products: productsWithVirtuals,
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

/**
 * Update product with variants
 * @route PUT /api/products/:id
 * @access Seller only
 */
export const updateProduct = async (req, res) => {
  try {
    const product = await productModel.findById(req.params.id);

    if (!product) {
      return res.status(404).json({
        success: false,
        message: "Product not found",
      });
    }

    if (product.seller.toString() !== req.user._id.toString()) {
      return res.status(403).json({
        success: false,
        message: "You are not authorized to update this product",
      });
    }

    const {
      title,
      description,
      category,
      subCategory,
      fabric,
      stock,
      isActive,
    } = req.body;

    let price = product.price;
    if (req.body.priceAmount) {
      price = {
        amount: parseFloat(req.body.priceAmount),
        currency: req.body.priceCurrency || product.price.currency,
      };
    }

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

    if (product.seller.toString() !== req.user._id.toString()) {
      return res.status(403).json({
        success: false,
        message: "You are not authorized to update this product",
      });
    }

    if (!req.files || req.files.length === 0) {
      return res.status(400).json({
        success: false,
        message: "Please upload at least one image",
      });
    }

    const newImages = req.files.map((file, index) => ({
      url: file.path,
      alt: req.body.altTexts?.[index] || `Product image ${index + 1}`,
      isMain: false,
    }));

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

    if (product.seller.toString() !== req.user._id.toString()) {
      return res.status(403).json({
        success: false,
        message: "You are not authorized to update this product",
      });
    }

    const { imageUrl } = req.body;

    if (!imageUrl) {
      return res.status(400).json({
        success: false,
        message: "Please provide image URL to remove",
      });
    }

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
    const products = await productModel
      .find({ isActive: true })
      .select("-__v")
      .sort({ createdAt: -1 })
      .populate("seller", "fullname email");

    const productsWithVirtuals = products.map((p) => ({
      ...p.toObject(),
      priceRange: p.priceRange,
      totalStock: p.totalStock,
    }));

    res.status(200).json({
      success: true,
      count: productsWithVirtuals.length,
      products: productsWithVirtuals,
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

    if (!product.isActive) {
      return res.status(404).json({
        success: false,
        message: "Product not available",
      });
    }

    const productWithVirtuals = {
      ...product.toObject(),
      priceRange: product.priceRange,
      totalStock: product.totalStock,
    };

    res.status(200).json({
      success: true,
      product: productWithVirtuals,
    });
  } catch (error) {
    console.error("Get public product error:", error);
    res.status(500).json({
      success: false,
      message: "Server error while fetching product",
    });
  }
};