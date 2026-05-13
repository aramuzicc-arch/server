import multer from "multer";

const maxVideoBytes = Number(process.env.UPLOAD_MAX_VIDEO_MB || 200) * 1024 * 1024;
const maxImageBytes = Number(process.env.UPLOAD_MAX_IMAGE_MB || 25) * 1024 * 1024;

export const upload = multer({
  storage: multer.memoryStorage(),
  limits: { fileSize: Math.max(maxVideoBytes, maxImageBytes) },
});
