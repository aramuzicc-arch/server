import { Router } from "express";
import { requireAuth } from "../middleware/auth.js";
import { Product } from "../models/Product.js";
import { Album } from "../models/Album.js";
import { GalleryItem } from "../models/GalleryItem.js";
import { Message } from "../models/Message.js";
import { Booking } from "../models/Booking.js";
import { Order } from "../models/Order.js";
import { LiveShow } from "../models/LiveShow.js";
import { TourDate } from "../models/TourDate.js";
import { SiteContent } from "../models/SiteContent.js";
import { getPublicSiteContent, mergeSiteContentForUpsert } from "../lib/siteContent.js";
import { destroyCloudinaryAsset } from "../utils/cloudinaryUpload.js";
import { destroyPreviousIfUrlChanged } from "../lib/mediaLifecycle.js";

const router = Router();

router.use(requireAuth);

router.get("/messages", async (_req, res) => {
  const items = await Message.find().sort({ createdAt: -1 });
  res.json(items);
});

router.patch("/messages/:id/read", async (req, res) => {
  const item = await Message.findByIdAndUpdate(req.params.id, { read: true }, { new: true });
  res.json(item);
});

router.get("/bookings", async (_req, res) => {
  const items = await Booking.find().sort({ createdAt: -1 });
  res.json(items);
});

router.patch("/bookings/:id/status", async (req, res) => {
  const item = await Booking.findByIdAndUpdate(
    req.params.id,
    { status: req.body.status },
    { new: true },
  );
  res.json(item);
});

router.get("/orders", async (_req, res) => {
  const items = await Order.find().sort({ createdAt: -1 });
  res.json(items);
});

router.patch("/orders/:id/status", async (req, res) => {
  const item = await Order.findByIdAndUpdate(
    req.params.id,
    { status: req.body.status },
    { new: true },
  );
  res.json(item);
});

router.get("/site-content", async (_req, res) => {
  const merged = await getPublicSiteContent();
  const raw = await SiteContent.findOne({ slug: "main" }).lean();
  res.json({
    ...merged,
    aboutHeroImagePublicId: raw?.aboutHeroImagePublicId || "",
    aboutPortraitImagePublicId: raw?.aboutPortraitImagePublicId || "",
  });
});

router.put("/site-content", async (req, res) => {
  const prev = await SiteContent.findOne({ slug: "main" }).lean();
  const merged = mergeSiteContentForUpsert(prev, req.body);

  await destroyPreviousIfUrlChanged(
    prev?.aboutHeroImagePublicId,
    prev?.aboutHeroImage,
    merged.aboutHeroImage,
    "image",
  );
  await destroyPreviousIfUrlChanged(
    prev?.aboutPortraitImagePublicId,
    prev?.aboutPortraitImage,
    merged.aboutPortraitImage,
    "image",
  );

  const doc = await SiteContent.findOneAndUpdate(
    { slug: "main" },
    merged,
    { upsert: true, new: true, setDefaultsOnInsert: true },
  );
  res.json(doc);
});

router.get("/live-shows", async (_req, res) => {
  const items = await LiveShow.find().sort({ sortOrder: 1, createdAt: -1 });
  res.json(items);
});

router.post("/live-shows", async (req, res) => {
  res.status(201).json(await LiveShow.create(req.body));
});

router.put("/live-shows/:id", async (req, res) => {
  const prev = await LiveShow.findById(req.params.id).lean();
  await destroyPreviousIfUrlChanged(prev?.imagePublicId, prev?.image, req.body.image, "image");
  await destroyPreviousIfUrlChanged(prev?.videoPublicId, prev?.videoUrl, req.body.videoUrl, "video");
  res.json(await LiveShow.findByIdAndUpdate(req.params.id, req.body, { new: true }));
});

router.delete("/live-shows/:id", async (req, res) => {
  const prev = await LiveShow.findById(req.params.id).lean();
  if (prev?.imagePublicId) {
    try {
      await destroyCloudinaryAsset(prev.imagePublicId, "image");
    } catch (e) {
      console.error(e);
    }
  }
  if (prev?.videoPublicId) {
    try {
      await destroyCloudinaryAsset(prev.videoPublicId, "video");
    } catch (e) {
      console.error(e);
    }
  }
  await LiveShow.findByIdAndDelete(req.params.id);
  res.status(204).send();
});

router.get("/tour-dates", async (_req, res) => {
  const items = await TourDate.find().sort({ sortOrder: 1, createdAt: -1 });
  res.json(items);
});

router.post("/tour-dates", async (req, res) => {
  res.status(201).json(await TourDate.create(req.body));
});

router.put("/tour-dates/:id", async (req, res) => {
  res.json(await TourDate.findByIdAndUpdate(req.params.id, req.body, { new: true }));
});

router.delete("/tour-dates/:id", async (req, res) => {
  await TourDate.findByIdAndDelete(req.params.id);
  res.status(204).send();
});

router.post("/products", async (req, res) => res.status(201).json(await Product.create(req.body)));

router.put("/products/:id", async (req, res) => {
  const prev = await Product.findById(req.params.id).lean();
  await destroyPreviousIfUrlChanged(prev?.imagePublicId, prev?.image, req.body.image, "image");
  res.json(await Product.findByIdAndUpdate(req.params.id, req.body, { new: true }));
});

router.delete("/products/:id", async (req, res) => {
  const prev = await Product.findById(req.params.id).lean();
  if (prev?.imagePublicId) {
    try {
      await destroyCloudinaryAsset(prev.imagePublicId, "image");
    } catch (e) {
      console.error(e);
    }
  }
  await Product.findByIdAndDelete(req.params.id);
  res.status(204).send();
});

router.post("/albums", async (req, res) => {
  try {
    const doc = await Album.create(req.body);
    res.status(201).json(doc);
  } catch (e) {
    if (e?.name === "ValidationError" && e.errors) {
      const first = Object.values(e.errors)[0];
      const msg = first?.message || e.message || "Validation failed";
      return res.status(400).json({ message: msg });
    }
    console.error(e);
    res.status(500).json({ message: e?.message || "Could not create album" });
  }
});

router.put("/albums/:id", async (req, res) => {
  const prev = await Album.findById(req.params.id).lean();
  await destroyPreviousIfUrlChanged(prev?.coverPublicId, prev?.coverImage, req.body.coverImage, "image");
  await destroyPreviousIfUrlChanged(
    prev?.cloudinaryVideoPublicId,
    prev?.cloudinaryVideoUrl,
    req.body.cloudinaryVideoUrl,
    "video",
  );
  res.json(await Album.findByIdAndUpdate(req.params.id, req.body, { new: true }));
});

router.delete("/albums/:id", async (req, res) => {
  const prev = await Album.findById(req.params.id).lean();
  if (prev?.coverPublicId) {
    try {
      await destroyCloudinaryAsset(prev.coverPublicId, "image");
    } catch (e) {
      console.error(e);
    }
  }
  if (prev?.cloudinaryVideoPublicId) {
    try {
      await destroyCloudinaryAsset(prev.cloudinaryVideoPublicId, "video");
    } catch (e) {
      console.error(e);
    }
  }
  await Album.findByIdAndDelete(req.params.id);
  res.status(204).send();
});

router.post("/gallery", async (req, res) => res.status(201).json(await GalleryItem.create(req.body)));

router.delete("/gallery/:id", async (req, res) => {
  const prev = await GalleryItem.findById(req.params.id).lean();
  if (prev?.urlPublicId) {
    const rt = prev.urlResourceType === "video" ? "video" : "image";
    try {
      await destroyCloudinaryAsset(prev.urlPublicId, rt);
    } catch (e) {
      console.error(e);
    }
  }
  await GalleryItem.findByIdAndDelete(req.params.id);
  res.status(204).send();
});

export default router;
