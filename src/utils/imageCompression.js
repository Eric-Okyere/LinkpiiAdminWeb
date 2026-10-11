// Lightweight client-side image resize/compress using <canvas> - no extra
// dependency, so it works the same everywhere this app already runs.
// Keeps product-photo uploads fast and light on mobile data, which matters
// a lot here since most sellers are uploading straight from a phone camera
// (often several MB per shot) over mobile data.
//
// Always resolves to a usable File - if anything about compression fails
// (unsupported browser, corrupt image, etc.) it falls back to the original
// file untouched rather than blocking the upload.

const MAX_DIMENSION = 1600;
const JPEG_QUALITY = 0.82;
const SKIP_BELOW_BYTES = 300 * 1024; // not worth compressing small files

export async function compressImage(file, options = {}) {
  const maxDimension = options.maxDimension || MAX_DIMENSION;
  const quality = options.quality || JPEG_QUALITY;

  if (!file || !file.type || !file.type.startsWith("image/")) return file;
  if (file.type === "image/gif") return file; // preserve animation
  if (file.size <= SKIP_BELOW_BYTES) return file;
  if (typeof createImageBitmap !== "function" || typeof document === "undefined") return file;

  try {
    const bitmap = await createImageBitmap(file);
    const scale = Math.min(1, maxDimension / Math.max(bitmap.width, bitmap.height));
    const width = Math.max(1, Math.round(bitmap.width * scale));
    const height = Math.max(1, Math.round(bitmap.height * scale));

    const canvas = document.createElement("canvas");
    canvas.width = width;
    canvas.height = height;
    const ctx = canvas.getContext("2d");
    if (!ctx) return file;
    ctx.drawImage(bitmap, 0, 0, width, height);
    if (typeof bitmap.close === "function") bitmap.close();

    // JPEG for everything except PNG (keeps transparency, e.g. a logo/
    // screenshot used as a product photo) - GIF is already excluded above.
    const outputType = file.type === "image/png" ? "image/png" : "image/jpeg";

    const blob = await new Promise((resolve) => canvas.toBlob(resolve, outputType, quality));
    if (!blob || blob.size >= file.size) return file; // compression didn't actually help

    const newName =
      outputType === "image/jpeg" ? file.name.replace(/\.\w+$/, "") + ".jpg" : file.name;

    return new File([blob], newName, { type: outputType, lastModified: Date.now() });
  } catch (error) {
    console.error("Image compression skipped:", error);
    return file;
  }
}
