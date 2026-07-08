import mongoose from "mongoose";

// Image schema with url and alt
const imageSchema = new mongoose.Schema({
  url: {
    type: String,
    required: [true, "Image URL is required"],
  },
  alt: {
    type: String,
    required: [true, "Image alt text is required"],
    trim: true,
  },
  isMain: {
    type: Boolean,
    default: false,
  },
});

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

    // Pricing
    price: {
      amount: {
        type: Number,
        required: [true, "Please add product price"],
        min: [0, "Price cannot be negative"],
      },
      currency: {
        type: String,
        default: "INR",
        uppercase: true,
        enum: ["USD", "EUR", "GBP", "INR"],
      },
    },

    // Images (with url and alt)
    images: {
      type: [imageSchema],
      required: [true, "Please add at least one image"],
      validate: {
        validator: function (v) {
          return v.length > 0;
        },
        message: "Product must have at least one image",
      },
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
    availableSizes: {
      type: [String],
      enum: ["XS", "S", "M", "L", "XL", "XXL", "Free Size"],
      default: [],
    },

    colors: {
      type: [String],
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

    stock: {
      type: Number,
      required: [true, "Please add stock quantity"],
      min: [0, "Stock cannot be negative"],
      default: 0,
    },

    seller: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "user",
      required: true,
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
      },
    },
  },
  {
    timestamps: true,
  }
);

const productModel = mongoose.model("product", productSchema);

export default productModel;