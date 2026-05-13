import mongoose from "mongoose";

const liveShowSchema = new mongoose.Schema(
  {
    title: { type: String, required: true },
    subtitle: { type: String, default: "" },
    image: { type: String, required: true },
    imagePublicId: { type: String, default: "" },
    /** Cloudinary (or any) video URL for home “Live energy” */
    videoUrl: { type: String, default: "" },
    videoPublicId: { type: String, default: "" },
    sortOrder: { type: Number, default: 0 },
    active: { type: Boolean, default: true },
  },
  { timestamps: true },
);

export const LiveShow = mongoose.model("LiveShow", liveShowSchema);
