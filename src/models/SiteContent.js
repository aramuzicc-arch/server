import mongoose from "mongoose";

const timelineEntrySchema = new mongoose.Schema(
  {
    year: { type: String, required: true },
    title: { type: String, required: true },
    description: { type: String, default: "" },
    order: { type: Number, default: 0 },
  },
  { _id: false },
);

const statEntrySchema = new mongoose.Schema(
  {
    value: { type: Number, required: true },
    suffix: { type: String, default: "" },
    label: { type: String, required: true },
    order: { type: Number, default: 0 },
  },
  { _id: false },
);

const siteContentSchema = new mongoose.Schema(
  {
    slug: { type: String, default: "main", unique: true },
    aboutHeroTagline: { type: String, default: "" },
    aboutHeroImage: { type: String, default: "" },
    aboutPortraitImage: { type: String, default: "" },
    aboutHeroImagePublicId: { type: String, default: "" },
    aboutPortraitImagePublicId: { type: String, default: "" },
    aboutBioParagraphs: { type: [String], default: [] },
    timeline: { type: [timelineEntrySchema], default: [] },
    stats: { type: [statEntrySchema], default: [] },
    /** Shown on Contact / Bookings; editable in admin Settings */
    publicPhone: { type: String, default: "" },
  },
  { timestamps: true },
);

export const SiteContent = mongoose.model("SiteContent", siteContentSchema);
