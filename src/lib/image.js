"use client";

/**
 * Client-side image helpers: downscale uploads to a small square
 * dataURL so localStorage stays light and poster export stays fast.
 */

export function fileToImage(file) {
  return new Promise((resolve, reject) => {
    const url = URL.createObjectURL(file);
    const img = new Image();
    img.onload = () => {
      URL.revokeObjectURL(url);
      resolve(img);
    };
    img.onerror = () => {
      URL.revokeObjectURL(url);
      reject(new Error("ছবিটি পড়া যায়নি"));
    };
    img.src = url;
  });
}

/** Center-crop + resize any image to a square JPEG dataURL. */
export async function fileToSquareDataUrl(file, size = 512, quality = 0.85) {
  if (!file?.type?.startsWith("image/")) throw new Error("শুধু ছবি ফাইল দিন (JPG/PNG)");
  if (file.size > 8 * 1024 * 1024) throw new Error("ফাইল ৮MB-এর কম হতে হবে");
  const img = await fileToImage(file);
  return drawSquare(img, size, quality);
}

export function drawSquare(img, size = 512, quality = 0.85) {
  const side = Math.min(img.naturalWidth || img.videoWidth, img.naturalHeight || img.videoHeight);
  const sx = ((img.naturalWidth || img.videoWidth) - side) / 2;
  const sy = ((img.naturalHeight || img.videoHeight) - side) / 2;
  const canvas = document.createElement("canvas");
  canvas.width = size;
  canvas.height = size;
  const ctx = canvas.getContext("2d");
  ctx.drawImage(img, sx, sy, side, side, 0, 0, size, size);
  return canvas.toDataURL("image/jpeg", quality);
}

/** Grab current webcam frame as a square dataURL. */
export function videoToSquareDataUrl(video, size = 512, quality = 0.85) {
  const side = Math.min(video.videoWidth, video.videoHeight);
  const canvas = document.createElement("canvas");
  canvas.width = size;
  canvas.height = size;
  canvas.getContext("2d").drawImage(
    video,
    (video.videoWidth - side) / 2,
    (video.videoHeight - side) / 2,
    side,
    side,
    0,
    0,
    size,
    size
  );
  return canvas.toDataURL("image/jpeg", quality);
}

export function stopStream(stream) {
  stream?.getTracks?.().forEach((t) => t.stop());
}
