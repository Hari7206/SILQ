import mongoose from "mongoose";
import productModel from "./src/model/product.model.js";
import config from "./src/config/config.js";

async function migrateProducts() {
  try {
    console.log("🔄 Connecting to MongoDB...");
    await mongoose.connect(config.MONGODB_URI);
    console.log("✅ Connected to MongoDB");

    // Find all products without variants
    const products = await productModel.find({ variants: { $exists: false } });
    console.log(`📦 Found ${products.length} products to migrate`);

    if (products.length === 0) {
      console.log("✅ No products to migrate. All products already have variants!");
      process.exit(0);
    }

    for (const product of products) {
      console.log(`🔄 Migrating: ${product.title}`);

      // Convert old format to new variants format
      const colors = product.colors || ["Default"];
      const variantImages = product.images || [];

      const variants = colors.map((color, index) => ({
        color: color,
        colorCode: null,
        price: {
          amount: product.price?.amount || 0,
          currency: product.price?.currency || "INR",
        },
        stock: product.stock || 0,
        images: index === 0 
          ? variantImages.map(img => img.url || img) 
          : [],
        sku: null,
        isActive: true,
      }));

      // Update product
      await productModel.findByIdAndUpdate(product._id, {
        $set: {
          variants: variants,
          mainImage: variantImages[0]?.url || variantImages[0] || null,
        },
        $unset: {
          price: "",
          stock: "",
          images: "",
          colors: "",
        },
      });

      console.log(`✅ Migrated: ${product.title}`);
    }

    console.log("✅ Migration complete!");
    process.exit(0);
  } catch (error) {
    console.error("❌ Migration failed:", error);
    process.exit(1);
  }
}

migrateProducts();