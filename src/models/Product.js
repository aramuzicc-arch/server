import mongoose from "mongoose";

const productSchema = new mongoose.Schema(
  {
    name: { type: String, required: true },
    price: { type: Number, required: true },
    category: { type: String, required: true },
    image: { type: String, required: true },
    imagePublicId: { type: String, default: "" },
    badge: { type: String, enum: ["new", "sale", "none"], default: "none" },
    description: { type: String, default: "" },
  },
  { timestamps: true },
);

export const Product = mongoose.model("Product", productSchema);
