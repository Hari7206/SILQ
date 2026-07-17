import productModel from "../model/product.model.js";

export const createProduct = async (req, res) => {
  try {
    const {
      title,
      description,
      category,
      subCategory,
      gender,
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
      gender: gender || "Unisex",
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

    // ✅ Get ALL fields including variants
    const {
      title,
      description,
      category,
      subCategory,
      gender,
      variants,
      availableSizes,
      fabric,
      occasion,
      badges,
      isActive,
      isFeatured,
    } = req.body;

    // ✅ Parse variants if sent as JSON string (from FormData)
    let parsedVariants = variants;
    if (typeof variants === "string") {
      try {
        parsedVariants = JSON.parse(variants);
        if (!Array.isArray(parsedVariants)) {
          parsedVariants = [];
        }
      } catch {
        return res.status(400).json({
          success: false,
          message: "Invalid variants format",
        });
      }
    }

    // ✅ Validate variants if provided
    if (parsedVariants && parsedVariants.length > 0) {
      for (const variant of parsedVariants) {
        if (!variant.color || !variant.price?.amount || variant.stock === undefined) {
          return res.status(400).json({
            success: false,
            message: "Each variant must have color, price, and stock",
          });
        }
      }
      // ✅ Update variants
      product.variants = parsedVariants;
      // ✅ Update main image from first variant
      product.mainImage = parsedVariants[0]?.images?.[0] || null;
    }

    // ✅ Parse availableSizes
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

    // ✅ Parse occasion
    let parsedOccasion = occasion;
    if (typeof occasion === "string") {
      try {
        parsedOccasion = JSON.parse(occasion);
        if (!Array.isArray(parsedOccasion)) {
          parsedOccasion = [];
        }
      } catch {
        parsedOccasion = [];
      }
    }

    // ✅ Parse badges
    let parsedBadges = badges;
    if (typeof badges === "string") {
      try {
        parsedBadges = JSON.parse(badges);
      } catch {
        parsedBadges = {};
      }
    }

    // ✅ Update basic fields
    if (title) product.title = title;
    if (description) product.description = description;
    if (category) product.category = category;
    if (subCategory !== undefined) product.subCategory = subCategory;
    if (gender) product.gender = gender;
    if (fabric !== undefined) product.fabric = fabric;
    if (parsedSizes.length > 0) product.availableSizes = parsedSizes;
    if (parsedOccasion.length > 0) product.occasion = parsedOccasion;
    if (parsedBadges) product.badges = parsedBadges;
    if (isActive !== undefined) product.isActive = isActive;
    if (isFeatured !== undefined) product.isFeatured = isFeatured;

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


/**
 * Get product search suggestions (autocomplete)
 * @route GET /api/products/public/search-suggestions
 * @access Public
 */
export const getSearchSuggestions = async (req, res) => {
  try {
    const { q } = req.query;
    
    if (!q || q.length < 2) {
      return res.status(200).json({
        success: true,
        suggestions: [],
      });
    }

    const query = q.toLowerCase().trim();
    const words = query.split(" ").filter(w => w.length > 0);

    // Build search conditions
    const searchConditions = [];

    // For each word, check all fields
    for (const word of words) {
      searchConditions.push(
        { title: { $regex: word, $options: "i" } },
        { category: { $regex: word, $options: "i" } },
        { subCategory: { $regex: word, $options: "i" } },
        { gender: { $regex: word, $options: "i" } },
        { "variants.color": { $regex: word, $options: "i" } }
      );
    }

    // Product must match ALL words (at least one field per word)
    const products = await productModel
      .find({
        isActive: true,
        $and: words.map(() => ({ $or: searchConditions })),
      })
      .select("title category subCategory gender mainImage variants")
      .limit(10)
      .lean();

    // Format suggestions with relevance score
    const suggestions = products.map((product) => {
      // Count how many words matched
      let matchCount = 0;
      let matchedFields = [];

      for (const word of words) {
        if (product.title?.toLowerCase().includes(word)) {
          matchCount++;
          matchedFields.push("title");
        } else if (product.category?.toLowerCase().includes(word)) {
          matchCount++;
          matchedFields.push("category");
        } else if (product.subCategory?.toLowerCase().includes(word)) {
          matchCount++;
          matchedFields.push("subCategory");
        } else if (product.gender?.toLowerCase().includes(word)) {
          matchCount++;
          matchedFields.push("gender");
        } else if (product.variants?.some(v => v.color?.toLowerCase().includes(word))) {
          matchCount++;
          matchedFields.push("color");
        }
      }

      return {
        _id: product._id,
        title: product.title,
        category: product.category,
        subCategory: product.subCategory,
        gender: product.gender,
        mainImage: product.mainImage || product.variants?.[0]?.images?.[0] || null,
        matchCount,
        matchedFields: [...new Set(matchedFields)], // Unique fields
        relevance: matchCount / words.length, // % of words matched
      };
    });

    // Sort by relevance (highest first)
    suggestions.sort((a, b) => b.relevance - a.relevance);

    res.status(200).json({
      success: true,
      suggestions,
      count: suggestions.length,
    });

  } catch (error) {
    console.error("Search suggestions error:", error);
    res.status(500).json({
      success: false,
      message: "Server error while fetching suggestions",
    });
  }
};

// Helper: Find which field matched
function getMatchingField(product, query) {
  const fields = ["title", "category", "subCategory", "gender"];
  for (const field of fields) {
    if (product[field]?.toLowerCase().includes(query)) {
      return field;
    }
  }
  // Check variant colors
  if (product.variants?.some(v => v.color?.toLowerCase().includes(query))) {
    return "color";
  }
  return "title";
}


/**
 * Get related products (You May Also Like)
 * @route GET /api/products/public/related/:id
 * @access Public
 */
export const getRelatedProducts = async (req, res) => {
  try {
    const { id } = req.params;
    const { limit = 8 } = req.query;

    // Get the current product
    const currentProduct = await productModel.findById(id);
    if (!currentProduct) {
      return res.status(404).json({
        success: false,
        message: "Product not found",
      });
    }

    // Find related products (same category, gender, or subCategory)
    const relatedProducts = await productModel
      .find({
        _id: { $ne: id }, // Exclude current product
        isActive: true,
        $or: [
          { category: currentProduct.category },
          { gender: currentProduct.gender },
          { subCategory: currentProduct.subCategory },
        ],
      })
      .select("-__v")
      .sort({ createdAt: -1 })
      .limit(parseInt(limit))
      .populate("seller", "fullname email");

    // Add virtual fields
    const productsWithVirtuals = relatedProducts.map((p) => ({
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
    console.error("Get related products error:", error);
    res.status(500).json({
      success: false,
      message: "Server error while fetching related products",
    });
  }
};