import mongoose from "mongoose";

const tourDateSchema = new mongoose.Schema(
  {
    dateLabel: { type: String, required: true },
    venue: { type: String, required: true },
    location: { type: String, default: "" },
    ticketUrl: { type: String, default: "" },
    sortOrder: { type: Number, default: 0 },
    active: { type: Boolean, default: true },
  },
  { timestamps: true },
);

export const TourDate = mongoose.model("TourDate", tourDateSchema);
