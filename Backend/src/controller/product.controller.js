import productModel from "../model/product.model.js";

export const createProduct = async (req, res) => {
  try {
    console.log("Received body:", req.body);
    console.log("Received files:", req.files);
    console.log("Variants from body:", req.body.variants);
    const {
      title,
      description,
      category,
      subCategory,
      gender,
      brand,
      tags,
      weight,
      countryOfOrigin,
      careInstructions,
      seoTitle,
      seoDescription,
      variants,
      availableSizes,
      fabric,
      occasion,
      badges,
      isActive,
      isFeatured,
    } = req.body;

    if (!title || !description || !category) {
      return res.status(400).json({
        success: false,
        message: "Please provide title, description, and category",
      });
    }

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

    if (req.files && req.files.length > 0) {
      const uploadedUrls = req.files.map((file) => file.path);
      parsedVariants.forEach((variant, index) => {
        if (uploadedUrls[index]) {
          variant.images = [uploadedUrls[index]];
        }
      });
    }

    for (const variant of parsedVariants) {
      if (!variant.color || !variant.mrp?.amount || !variant.price?.amount || variant.stock === undefined) {
        return res.status(400).json({
          success: false,
          message: "Each variant must have color, MRP, price, and stock",
        });
      }
    }

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

    let parsedBadges = badges || {};
    if (typeof badges === "string") {
      try {
        parsedBadges = JSON.parse(badges);
      } catch {
        parsedBadges = {};
      }
    }

    let parsedWeight = weight;
    if (typeof weight === "string") {
      try {
        parsedWeight = JSON.parse(weight);
      } catch {
        parsedWeight = { value: 0, unit: "kg" };
      }
    }

    let parsedCareInstructions = careInstructions;
    if (typeof careInstructions === "string") {
      try {
        parsedCareInstructions = JSON.parse(careInstructions);
      } catch {
        parsedCareInstructions = [];
      }
    }

    let parsedTags = tags;
    if (typeof tags === "string") {
      try {
        parsedTags = JSON.parse(tags);
      } catch {
        parsedTags = [];
      }
    }

    const mainImage = parsedVariants[0]?.images?.[0] || null;

    const cleanedVariants = parsedVariants.map((v) => ({
      ...v,
      sku: v.sku || undefined,
    }));

    const product = await productModel.create({
      title,
      description,
      category,
      subCategory: subCategory || null,
      gender: gender || "Unisex",
      brand: brand || null,
      mainImage,
      variants: cleanedVariants,
      availableSizes: parsedSizes || [],
      fabric: fabric || null,
      occasion: occasion || [],
      tags: parsedTags || [],
      weight: parsedWeight || { value: 0, unit: "kg" },
      countryOfOrigin: countryOfOrigin || "India",
      careInstructions: parsedCareInstructions || [],
      badges: parsedBadges,
      seoTitle: seoTitle || null,
      seoDescription: seoDescription || null,
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

export const getProducts = async (req, res) => {
  try {
    const products = await productModel.find({ seller: req.user._id });

    const productsWithVirtuals = products.map((p) => ({
      ...p.toObject(),
      priceRange: p.priceRange,
      totalStock: p.totalStock,
      maxDiscount: p.maxDiscount,
      bestDeal: p.bestDeal,
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
      gender,
      brand,
      tags,
      weight,
      countryOfOrigin,
      careInstructions,
      seoTitle,
      seoDescription,
      variants,
      availableSizes,
      fabric,
      occasion,
      badges,
      isActive,
      isFeatured,
    } = req.body;

    // Parse variants if needed
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

    // Update variants if provided
    if (parsedVariants && parsedVariants.length > 0) {
      // Validate each variant
      for (const variant of parsedVariants) {
        if (!variant.color || !variant.mrp?.amount || !variant.price?.amount || variant.stock === undefined) {
          return res.status(400).json({
            success: false,
            message: "Each variant must have color, MRP, price, and stock",
          });
        }
      }
      product.variants = parsedVariants;
      product.mainImage = parsedVariants[0]?.images?.[0] || null;
    }

    // Parse other JSON fields
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

    let parsedBadges = badges;
    if (typeof badges === "string") {
      try {
        parsedBadges = JSON.parse(badges);
      } catch {
        parsedBadges = {};
      }
    }

    let parsedWeight = weight;
    if (typeof weight === "string") {
      try {
        parsedWeight = JSON.parse(weight);
      } catch {
        parsedWeight = { value: 0, unit: "kg" };
      }
    }

    let parsedCareInstructions = careInstructions;
    if (typeof careInstructions === "string") {
      try {
        parsedCareInstructions = JSON.parse(careInstructions);
      } catch {
        parsedCareInstructions = [];
      }
    }

    let parsedTags = tags;
    if (typeof tags === "string") {
      try {
        parsedTags = JSON.parse(tags);
      } catch {
        parsedTags = [];
      }
    }

    // Update fields
    if (title) product.title = title;
    if (description) product.description = description;
    if (category) product.category = category;
    if (subCategory !== undefined) product.subCategory = subCategory;
    if (gender) product.gender = gender;
    if (brand !== undefined) product.brand = brand;
    if (parsedTags) product.tags = parsedTags;
    if (parsedWeight) product.weight = parsedWeight;
    if (countryOfOrigin !== undefined) product.countryOfOrigin = countryOfOrigin;
    if (parsedCareInstructions) product.careInstructions = parsedCareInstructions;
    if (seoTitle !== undefined) product.seoTitle = seoTitle;
    if (seoDescription !== undefined) product.seoDescription = seoDescription;
    if (fabric !== undefined) product.fabric = fabric;
    if (parsedSizes && parsedSizes.length > 0) product.availableSizes = parsedSizes;
    if (parsedOccasion && parsedOccasion.length > 0) product.occasion = parsedOccasion;
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
      message: error.message || "Server error while updating product",
    });
  }
};
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

    const newImages = req.files.map((file) => file.path);
    if (product.variants.length > 0) {
      product.variants[0].images.push(...newImages);
    }

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

    if (product.variants.length > 0) {
      product.variants[0].images = product.variants[0].images.filter(
        (img) => img !== imageUrl
      );
      if (product.mainImage === imageUrl) {
        product.mainImage = product.variants[0]?.images?.[0] || null;
      }
    }

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
      maxDiscount: p.maxDiscount,
      bestDeal: p.bestDeal,
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

    product.viewCount += 1;
    await product.save();

    const productWithVirtuals = {
      ...product.toObject(),
      priceRange: product.priceRange,
      totalStock: product.totalStock,
      maxDiscount: product.maxDiscount,
      bestDeal: product.bestDeal,
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

    const searchConditions = [];

    for (const word of words) {
      searchConditions.push(
        { title: { $regex: word, $options: "i" } },
        { category: { $regex: word, $options: "i" } },
        { subCategory: { $regex: word, $options: "i" } },
        { gender: { $regex: word, $options: "i" } },
        { brand: { $regex: word, $options: "i" } },
        { tags: { $regex: word, $options: "i" } },
        { "variants.color": { $regex: word, $options: "i" } }
      );
    }

    const products = await productModel
      .find({
        isActive: true,
        $and: words.map(() => ({ $or: searchConditions })),
      })
      .select("title category subCategory gender brand mainImage variants tags")
      .limit(10)
      .lean();

    const suggestions = products.map((product) => {
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
        } else if (product.brand?.toLowerCase().includes(word)) {
          matchCount++;
          matchedFields.push("brand");
        } else if (product.tags?.some(t => t.toLowerCase().includes(word))) {
          matchCount++;
          matchedFields.push("tags");
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
        brand: product.brand,
        mainImage: product.mainImage || product.variants?.[0]?.images?.[0] || null,
        matchCount,
        matchedFields: [...new Set(matchedFields)],
        relevance: matchCount / words.length,
      };
    });

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

export const getRelatedProducts = async (req, res) => {
  try {
    const { id } = req.params;
    const { limit = 8 } = req.query;
    const limitNum = parseInt(limit);

    const currentProduct = await productModel.findById(id).lean();
    if (!currentProduct) {
      return res.status(404).json({
        success: false,
        message: "Product not found",
      });
    }

    // Only hard requirement: same category, active, not the same product.
    // Everything else (subCategory, gender, brand, color) is a *ranking* signal, not a filter.
    const products = await productModel
      .find({
        _id: { $ne: id },
        isActive: true,
        category: currentProduct.category,
      })
      .select("-__v")
      .populate("seller", "fullname email")
      .lean();

    const safeArray = (value) => (Array.isArray(value) ? value : []);

    const currentColors = safeArray(currentProduct.variants)
      .map((v) => v.color?.toLowerCase())
      .filter(Boolean);

    const scoredProducts = products.map((product) => {
      let score = 0;
      const matchReasons = [];

      // subCategory is the real "type" match (pajama vs shirt) — weight it highest
      if (
        currentProduct.subCategory &&
        product.subCategory === currentProduct.subCategory
      ) {
        score += 100;
        matchReasons.push("subCategory");
      }

      if (product.gender === currentProduct.gender) {
        score += 20;
        matchReasons.push("gender");
      }

      if (product.brand && product.brand === currentProduct.brand) {
        score += 10;
        matchReasons.push("brand");
      }

      const productColors = safeArray(product.variants)
        .map((v) => v.color?.toLowerCase())
        .filter(Boolean);
      const matchingColors = currentColors.filter((c) =>
        productColors.includes(c)
      );
      if (matchingColors.length > 0) {
        score += Math.min(matchingColors.length * 5, 10);
        matchReasons.push(`color:${matchingColors.join(",")}`);
      }

      const prices = safeArray(product.variants)
        .map((v) => v.price?.amount)
        .filter(Boolean);
      const priceRange =
        prices.length > 0
          ? { min: Math.min(...prices), max: Math.max(...prices) }
          : { min: 0, max: 0 };

      let bestDeal = null;
      let bestDiscount = 0;
      safeArray(product.variants).forEach((v) => {
        if (v.mrp?.amount && v.price?.amount) {
          const discount = ((v.mrp.amount - v.price.amount) / v.mrp.amount) * 100;
          if (discount > bestDiscount) {
            bestDiscount = discount;
            bestDeal = { color: v.color, discountPercentage: discount };
          }
        }
      });

      return {
        ...product,
        score,
        matchReasons,
        relevance: score,
        priceRange,
        totalStock: safeArray(product.variants).reduce(
          (sum, v) => sum + (v.stock || 0),
          0
        ),
        maxDiscount: bestDiscount,
        bestDeal,
      };
    });

    // Highest score (best subCategory/gender/brand/color match) first.
    // If not enough subCategory matches exist, lower-scored same-category items fill the rest naturally.
    const relatedProducts = scoredProducts
      .sort((a, b) => b.score - a.score)
      .slice(0, limitNum);

    res.status(200).json({
      success: true,
      count: relatedProducts.length,
      products: relatedProducts,
    });
  } catch (error) {
    console.error("Get related products error:", error);
    res.status(500).json({
      success: false,
      message: "Server error while fetching related products",
    });
  }
};
export const getPublicProductBySlug = async (req, res) => {
  try {
    const { slug } = req.params;

    const product = await productModel
      .findOne({ slug: slug, isActive: true })
      .select("-__v")
      .populate("seller", "fullname email");

    if (!product) {
      return res.status(404).json({
        success: false,
        message: "Product not found",
      });
    }

    product.viewCount += 1;
    await product.save();

    const productWithVirtuals = {
      ...product.toObject(),
      priceRange: product.priceRange,
      totalStock: product.totalStock,
      maxDiscount: product.maxDiscount,
      bestDeal: product.bestDeal,
    };

    res.status(200).json({
      success: true,
      product: productWithVirtuals,
    });
  } catch (error) {
    console.error("Get public product by slug error:", error);
    res.status(500).json({
      success: false,
      message: "Server error while fetching product",
    });
  }
};