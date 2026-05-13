import cloudinary from "../config/cloudinary.js";

function uploadBuffer(buffer, options) {
  return new Promise((resolve, reject) => {
    const stream = cloudinary.uploader.upload_stream(options, (error, result) => {
      if (error) {
        reject(error);
        return;
      }
      resolve(result);
    });
    stream.end(buffer);
  });
}

export function uploadImageBuffer(buffer, folder = "ara/images") {
  return uploadBuffer(buffer, { folder, resource_type: "image" });
}

export function uploadVideoBuffer(buffer, folder = "ara/videos") {
  return uploadBuffer(buffer, { folder, resource_type: "video" });
}

/**
 * @param {string} publicId
 * @param {"image" | "video"} resourceType
 */
export async function destroyCloudinaryAsset(publicId, resourceType = "image") {
  if (!publicId || typeof publicId !== "string") return;
  const rt = resourceType === "video" ? "video" : "image";
  await cloudinary.uploader.destroy(publicId, { resource_type: rt });
}
