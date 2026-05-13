import { destroyCloudinaryAsset } from "../utils/cloudinaryUpload.js";

export async function destroyPreviousIfUrlChanged(prevPublicId, prevUrl, nextUrl, resourceType) {
  if (!prevPublicId || !prevUrl) return;
  if (prevUrl === nextUrl) return;
  try {
    await destroyCloudinaryAsset(prevPublicId, resourceType);
  } catch (e) {
    console.error("cloudinary destroy", e);
  }
}
