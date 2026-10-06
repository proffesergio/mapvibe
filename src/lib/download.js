"use client";

import { toPng } from "html-to-image";

export const POSTER_SIZE = 1080;
export const VIRAL_NOTICE =
  "ছবিটি সেভ হয়েছে! আপনার ফেসবুক ওয়ালে বা স্টোরিতে পোস্ট করে বন্ধুদের চমকে দিন।";

/**
 * Export a DOM node as a 1080x1080 PNG and trigger browser download.
 * The poster node itself should be styled at 1080px; pixelRatio scales
 * smaller preview nodes up without blurring text.
 */
export async function downloadPoster(node, filename = "mapvibe-1080.png") {
  if (!node) throw new Error("Poster node not found");
  const dataUrl = await toPng(node, {
    cacheBust: true,
    pixelRatio: 3,
    width: POSTER_SIZE,
    height: POSTER_SIZE,
    style: { margin: "0", transform: "none" },
  });
  triggerDownload(dataUrl, filename);
  return dataUrl;
}

export function triggerDownload(dataUrl, filename) {
  const link = document.createElement("a");
  link.download = filename;
  link.href = dataUrl;
  document.body.appendChild(link);
  link.click();
  link.remove();
}
