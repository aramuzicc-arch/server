import mongoose from "mongoose";

const galleryItemSchema = new mongoose.Schema(
  {
    title: { type: String, required: true },
    type: { type: String, enum: ["photo", "video"], required: true },
    url: { type: String, required: true },
    thumbnail: { type: String, required: true },
    urlPublicId: { type: String, default: "" },
    /** image | video — used when deleting from Cloudinary */
    urlResourceType: { type: String, enum: ["image", "video"], default: "image" },
  },
  { timestamps: true },
);

export const GalleryItem = mongoose.model("GalleryItem", galleryItemSchema);
