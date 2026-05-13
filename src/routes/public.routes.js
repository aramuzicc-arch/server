import { Router } from "express";
import { Product } from "../models/Product.js";
import { Album } from "../models/Album.js";
import { GalleryItem } from "../models/GalleryItem.js";
import { Message } from "../models/Message.js";
import { Booking } from "../models/Booking.js";
import { Order } from "../models/Order.js";
import { LiveShow } from "../models/LiveShow.js";
import { TourDate } from "../models/TourDate.js";
import { getPublicSiteContent } from "../lib/siteContent.js";
import { notifyAdmin } from "../utils/mail.js";

const router = Router();

router.get("/site-content", async (_req, res) => {
  res.json(await getPublicSiteContent());
});

router.get("/live-shows", async (_req, res) => {
  const items = await LiveShow.find({ active: true }).sort({ sortOrder: 1, createdAt: -1 });
  res.json(items);
});

router.get("/tour-dates", async (_req, res) => {
  const items = await TourDate.find({ active: true }).sort({ sortOrder: 1, createdAt: -1 });
  res.json(items);
});

router.get("/products", async (_req, res) => {
  const items = await Product.find().sort({ createdAt: -1 });
  res.json(items);
});

router.get("/albums", async (req, res) => {
  let q = Album.find();
  if (req.query.latestDrops === "true") {
    q = q.where({ isLatestDrop: true });
  }
  const items = await q.sort({ createdAt: -1 });
  res.json(items);
});

router.get("/gallery", async (_req, res) => {
  const items = await GalleryItem.find().sort({ createdAt: -1 });
  res.json(items);
});

router.post("/contact", async (req, res) => {
  const message = await Message.create(req.body);
  try {
    await notifyAdmin({
      subject: `[ARA] Contact: ${message.subject}`,
      text: `Name: ${message.name}\nEmail: ${message.email}${message.phone ? `\nPhone: ${message.phone}` : ""}\nSubject: ${message.subject}\n\n${message.message}`,
    });
  } catch (e) {
    console.error("notify contact", e);
  }
  res.status(201).json(message);
});

router.post("/bookings", async (req, res) => {
  const booking = await Booking.create(req.body);
  try {
    await notifyAdmin({
      subject: `[ARA] New booking (${booking.eventType})`,
      text: `Contact: ${booking.contactName || "?"} <${booking.contactEmail || "?"}>${booking.contactPhone ? `\nPhone: ${booking.contactPhone}` : ""}\nEvent: ${booking.eventName}\nDate: ${booking.date}\nBudget: ${booking.budget}\nLocation: ${booking.location}\nAttendance: ${booking.attendance}\nNotes:\n${booking.notes}`,
    });
  } catch (e) {
    console.error("notify booking", e);
  }
  res.status(201).json(booking);
});

router.post("/orders", async (req, res) => {
  const { customer, items, total, notes } = req.body;
  if (!customer?.name || !customer?.email || !Array.isArray(items) || items.length === 0 || typeof total !== "number") {
    return res.status(400).json({ message: "Invalid order payload" });
  }
  const order = await Order.create({ customer, items, total, notes: notes || "" });
  try {
    await notifyAdmin({
      subject: `[ARA] New order #${order._id}`,
      text: `Customer: ${customer.name} <${customer.email}>\nTotal: $${total.toFixed(2)}\nAddress: ${customer.address}, ${customer.city} ${customer.zip} ${customer.country}\nItems:\n${items.map((i) => `- ${i.name} x${i.quantity} @ $${i.price}`).join("\n")}`,
    });
  } catch (e) {
    console.error("notify order", e);
  }
  res.status(201).json(order);
});

export default router;
