import mongoose from "mongoose";

const productSchema = new mongoose.Schema(
  {
    name: { type: String, required: true },
    category: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Category",
      required: true,
    },
    brand: { type: String, required: true },
    price: { type: Number, required: true },
    images: { type: [String], required: true }, // array of images
    sizes: { type: [String], default: [] },
    description: { type: String }, // optional sizes
  },
  { timestamps: true }
);

const Product = mongoose.model("Product", productSchema);

export default Product;
