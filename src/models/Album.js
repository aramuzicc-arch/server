import mongoose from "mongoose";

const albumSchema = new mongoose.Schema(
  {
    title: { type: String, required: true },
    type: { type: String, enum: ["album", "single", "instrumental", "video"], required: true },
    genre: { type: String, required: true },
    coverImage: { type: String, required: true },
    coverPublicId: { type: String, default: "" },
    releaseDate: { type: String, required: true },
    description: { type: String, default: "" },
    mediaType: { type: String, enum: ["audio", "video"], default: "audio" },
    youtubeUrl: { type: String, default: "" },
    /** Cloudinary-hosted catalog video (preferred over YouTube link when set). */
    cloudinaryVideoUrl: { type: String, default: "" },
    cloudinaryVideoPublicId: { type: String, default: "" },
    streamingLinks: {
      spotify: { type: String, default: "" },
      apple: { type: String, default: "" },
      deezer: { type: String, default: "" },
      tidal: { type: String, default: "" },
      soundcloud: { type: String, default: "" },
    },
    isLatestDrop: { type: Boolean, default: false },
  },
  { timestamps: true },
);

export const Album = mongoose.model("Album", albumSchema);
