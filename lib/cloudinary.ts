type CloudinaryOptions = {
  width?: number;
  height?: number;
  crop?: "fill" | "fit" | "thumb" | "scale" | "limit";
  quality?: "auto" | number;
  format?: "auto" | "jpg" | "png" | "webp" | "avif";
};

/**
 * Build a Cloudinary delivery URL with sensible defaults (f_auto, q_auto).
 */
export function cloudinaryUrl(publicId: string, opts: CloudinaryOptions = {}) {
  const cloudName = process.env.NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME;
  if (!cloudName) {
    throw new Error("NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME is not set");
  }

  const parts = ["f_auto", `q_${opts.quality ?? "auto"}`];
  if (opts.width) parts.push(`w_${opts.width}`);
  if (opts.height) parts.push(`h_${opts.height}`);
  if (opts.crop) parts.push(`c_${opts.crop}`);
  if (opts.format && opts.format !== "auto") parts.push(`f_${opts.format}`);

  const transformation = parts.join(",");
  return `https://res.cloudinary.com/${cloudName}/image/upload/${transformation}/${publicId}`;
}
