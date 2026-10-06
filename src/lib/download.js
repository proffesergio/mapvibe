"use client";

import { toJpeg, toPng } from "html-to-image";

export const POSTER_SIZE = 1080;
export const VIRAL_NOTICE =
  "ফাইলটি সেভ হয়েছে! আপনার ফেসবুক ওয়ালে বা স্টোরিতে পোস্ট করে বন্ধুদের চমকে দিন।";

const BASE_OPTS = {
  cacheBust: true,
  pixelRatio: 2,
  width: POSTER_SIZE,
  height: POSTER_SIZE,
  style: { margin: "0", transform: "none" },
};

/** Render the 1080 poster node to a PNG dataURL (shared by all formats). */
async function renderPng(node) {
  if (!node) throw new Error("Poster node not found");
  return toPng(node, BASE_OPTS);
}

/**
 * Export a DOM node as a 1080x1080 PNG and trigger browser download.
 * The poster node itself should be styled at 1080px; pixelRatio scales
 * smaller preview nodes up without blurring text.
 */
export async function downloadPoster(node, filename = "mapvibe-1080.png") {
  const dataUrl = await renderPng(node);
  triggerDownload(dataUrl, filename);
  return dataUrl;
}

/** 1080x1080 JPG (smaller file, easy to share on Messenger/WhatsApp). */
export async function downloadJpg(node, filename = "mapvibe-1080.jpg") {
  if (!node) throw new Error("Poster node not found");
  const dataUrl = await toJpeg(node, { ...BASE_OPTS, quality: 0.92, backgroundColor: "#ffffff" });
  triggerDownload(dataUrl, filename);
  return dataUrl;
}

/** Square one-page PDF (1080px → 810pt) for print / archive. */
export async function downloadPdf(node, filename = "mapvibe-1080.pdf") {
  const dataUrl = await renderPng(node);
  const { jsPDF } = await import("jspdf");
  const pt = (POSTER_SIZE * 72) / 96; // 810pt square page
  const pdf = new jsPDF({ orientation: "portrait", unit: "pt", format: [pt, pt] });
  pdf.addImage(dataUrl, "PNG", 0, 0, pt, pt);
  pdf.save(filename);
  return filename;
}

export function triggerDownload(dataUrl, filename) {
  const link = document.createElement("a");
  link.download = filename;
  link.href = dataUrl;
  document.body.appendChild(link);
  link.click();
  link.remove();
}
