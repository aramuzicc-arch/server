import { Router } from "express";
import { requireAuth } from "../middleware/auth.js";
import { upload } from "../middleware/upload.js";
import {
  uploadImageBuffer,
  uploadVideoBuffer,
  destroyCloudinaryAsset,
} from "../utils/cloudinaryUpload.js";

const router = Router();

router.post("/image", requireAuth, upload.single("image"), async (req, res) => {
  if (!req.file) {
    return res.status(400).json({ message: "Image file is required" });
  }

  const result = await uploadImageBuffer(req.file.buffer, "ara/images");
  return res.json({
    url: result.secure_url,
    publicId: result.public_id,
    resourceType: "image",
  });
});

router.post("/video", requireAuth, upload.single("video"), async (req, res) => {
  if (!req.file) {
    return res.status(400).json({ message: "Video file is required" });
  }

  const result = await uploadVideoBuffer(req.file.buffer, "ara/videos");
  return res.json({
    url: result.secure_url,
    publicId: result.public_id,
    resourceType: "video",
    thumbnailUrl: result.thumbnail_url || result.secure_url,
  });
});

/** Remove a file from Cloudinary (admin only). */
router.post("/delete-asset", requireAuth, async (req, res) => {
  const { publicId, resourceType } = req.body || {};
  if (!publicId || typeof publicId !== "string") {
    return res.status(400).json({ message: "publicId is required" });
  }
  const rt = resourceType === "video" ? "video" : "image";
  await destroyCloudinaryAsset(publicId, rt);
  return res.status(204).send();
});

export default router;
