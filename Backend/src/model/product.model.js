import mongoose from "mongoose";

const variantSchema = new mongoose.Schema({
  color: {
    type: String,
    required: [true, "Please add color name"],
    trim: true,
  },
  colorCode: {
    type: String,
    default: null,
    trim: true,
  },
  mrp: {
    amount: {
      type: Number,
      required: [true, "Please add MRP for this variant"],
      min: [0, "MRP cannot be negative"],
    },
    currency: {
      type: String,
      default: "INR",
      uppercase: true,
      enum: ["USD", "EUR", "GBP", "INR"],
    },
  },
  price: {
    amount: {
      type: Number,
      required: [true, "Please add price for this variant"],
      min: [0, "Price cannot be negative"],
    },
    currency: {
      type: String,
      default: "INR",
      uppercase: true,
      enum: ["USD", "EUR", "GBP", "INR"],
    },
  },
  discountPercentage: {
    type: Number,
    default: 0,
    min: 0,
    max: 100,
  },
  stock: {
    type: Number,
    required: [true, "Please add stock for this variant"],
    min: [0, "Stock cannot be negative"],
    default: 0,
  },
  images: {
    type: [String],
    default: [],
  },
  sku: {
    type: String,
    unique: true,
    sparse: true,
    trim: true,
  },
  isActive: {
    type: Boolean,
    default: true,
  },
}, { _id: true });

const productSchema = new mongoose.Schema(
  {
    title: {
      type: String,
      required: [true, "Please add product title"],
      trim: true,
      maxlength: [100, "Title cannot be more than 100 characters"],
    },
    slug: {
      type: String,
      unique: true,
      lowercase: true,
      trim: true,
      index: true,
    },
    description: {
      type: String,
      required: [true, "Please add product description"],
      trim: true,
    },
    category: {
      type: String,
      required: [true, "Please add product category"],
      trim: true,
    },
    subCategory: {
      type: String,
      trim: true,
      default: null,
    },
    gender: {
      type: String,
      enum: ["Men", "Women", "Kids", "Unisex"],
      default: "Unisex",
    },
    brand: {
      type: String,
      default: null,
      trim: true,
      index: true,
    },
    mainImage: {
      type: String,
      default: null,
    },
    variants: {
      type: [variantSchema],
      required: [true, "Please add at least one variant"],
      validate: {
        validator: function (v) {
          return v.length > 0;
        },
        message: "Product must have at least one variant",
      },
    },
    availableSizes: {
      type: [String],
      enum: ["XS", "S", "M", "L", "XL", "XXL"],
      default: [],
    },
    fabric: {
      type: String,
      trim: true,
      default: null,
    },
    occasion: {
      type: [String],
      default: [],
    },
    tags: {
      type: [String],
      default: [],
      index: true,
    },
    weight: {
      value: {
        type: Number,
        default: 0,
        min: [0, "Weight cannot be negative"],
      },
      unit: {
        type: String,
        enum: ["kg", "g", "lb", "oz"],
        default: "kg",
      },
    },
    countryOfOrigin: {
      type: String,
      default: "India",
      trim: true,
    },
    careInstructions: {
      type: [String],
      default: [],
    },
    seller: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "user",
      required: true,
    },
    badges: {
      sevenDayReturn: { type: Boolean, default: false },
      cashOnDelivery: { type: Boolean, default: false },
      silkAssured: { type: Boolean, default: false },
      freeShipping: { type: Boolean, default: false },
      authenticProduct: { type: Boolean, default: false },
    },
    viewCount: {
      type: Number,
      default: 0,
      min: 0,
    },
    soldCount: {
      type: Number,
      default: 0,
      min: 0,
    },
    wishlistCount: {
      type: Number,
      default: 0,
      min: 0,
    },
    seoTitle: {
      type: String,
      default: null,
      trim: true,
    },
    seoDescription: {
      type: String,
      default: null,
      trim: true,
    },
    isActive: {
      type: Boolean,
      default: true,
    },
    isFeatured: {
      type: Boolean,
      default: false,
    },
    ratings: {
      average: {
        type: Number,
        default: 0,
        min: 0,
        max: 5,
      },
      count: {
        type: Number,
        default: 0,
        min: 0,
      },
    },
  },
  {
    timestamps: true,
  }
);

productSchema.virtual("priceRange").get(function () {
  if (!this.variants || this.variants.length === 0) return null;
  const prices = this.variants.map((v) => v.price.amount);
  return {
    min: Math.min(...prices),
    max: Math.max(...prices),
  };
});

productSchema.virtual("totalStock").get(function () {
  if (!this.variants || this.variants.length === 0) return 0;
  return this.variants.reduce((sum, v) => sum + v.stock, 0);
});

productSchema.virtual("maxDiscount").get(function () {
  if (!this.variants || this.variants.length === 0) return 0;
  const discounts = this.variants.map((v) => v.discountPercentage || 0);
  return Math.max(...discounts);
});

productSchema.virtual("bestDeal").get(function () {
  if (!this.variants || this.variants.length === 0) return null;
  let best = this.variants[0];
  for (const variant of this.variants) {
    if (variant.discountPercentage > best.discountPercentage) {
      best = variant;
    }
  }
  return best;
});

productSchema.pre("save", function () {
  if (this.title && !this.slug) {
    this.slug = this.title
      .toLowerCase()
      .replace(/[^a-zA-Z0-9\s]/g, "")
      .replace(/\s+/g, "-")
      .substring(0, 100);
  }

  if (this.variants && this.variants.length > 0) {
    this.variants.forEach((variant) => {
      if (variant.mrp?.amount > 0 && variant.price?.amount > 0) {
        const discount = ((variant.mrp.amount - variant.price.amount) / variant.mrp.amount) * 100;
        variant.discountPercentage = Math.round(discount * 100) / 100;
      } else {
        variant.discountPercentage = 0;
      }
    });
  }
});

productSchema.methods.getPriceDisplay = function () {
  const priceRange = this.priceRange;
  if (!priceRange) return { price: "N/A" };
  
  return {
    price: `₹${priceRange.min} - ₹${priceRange.max}`,
    discount: this.maxDiscount > 0 ? `${Math.round(this.maxDiscount)}% OFF` : null,
    bestDeal: this.bestDeal,
  };
};

const productModel = mongoose.model("product", productSchema);

export default productModel;