import mongoose from "mongoose";

const saveProductSchema = new mongoose.Schema({
  userId: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
  products: [
    {
      productId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Product",
        required: true,
      },
      size: { type: String, required: true },
      quantity: { type: Number, required: true },
      addedAt: { type: Date, default: Date.now },
    },
  ],
});

const SavedProduct = mongoose.model("SavedProduct", saveProductSchema);

export default SavedProduct;
