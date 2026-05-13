import mongoose from "mongoose";

const bookingSchema = new mongoose.Schema(
  {
    eventType: { type: String, required: true },
    eventName: { type: String, default: "" },
    date: { type: String, default: "" },
    budget: { type: String, default: "negotiable" },
    location: { type: String, default: "" },
    attendance: { type: String, default: "" },
    notes: { type: String, default: "" },
    contactName: { type: String, default: "" },
    contactEmail: { type: String, default: "" },
    contactPhone: { type: String, default: "" },
    status: { type: String, enum: ["pending", "confirmed", "cancelled"], default: "pending" },
  },
  { timestamps: true },
);

export const Booking = mongoose.model("Booking", bookingSchema);
