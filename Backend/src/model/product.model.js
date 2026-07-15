import mongoose from "mongoose";

// Sub-schema for variants
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

// Main Product Schema
const productSchema = new mongoose.Schema(
  {
    // Basic Info
    title: {
      type: String,
      required: [true, "Please add product title"],
      trim: true,
      maxlength: [100, "Title cannot be more than 100 characters"],
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

const productModel = mongoose.model("product", productSchema);

export default productModel;