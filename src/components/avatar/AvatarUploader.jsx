"use client";

import { useEffect, useRef, useState } from "react";
import { usePersistentState } from "@/hooks/usePersistentState";
import { fileToSquareDataUrl, stopStream, videoToSquareDataUrl } from "@/lib/image";
import { cn } from "@/lib/cn";
import { Button } from "@/components/ui/Button";
import { OAuthButtons } from "@/components/auth/OAuthButtons";

/**
 * Phase 3 (Guest-first): file upload / drag-drop / webcam → circle preview.
 * Avatar persisted as a downscaled dataURL in localStorage (zero-DB).
 * OAuth auto-fetch arrives later; this is the clean fallback + primary path.
 */
export function AvatarUploader() {
  const [avatar, setAvatar] = usePersistentState("avatar", null);
  const [name, setName] = usePersistentState("display-name", "");
  const [drag, setDrag] = useState(false);
  const [camOpen, setCamOpen] = useState(false);
  const [camError, setCamError] = useState("");
  const [error, setError] = useState("");
  const fileRef = useRef(null);
  const videoRef = useRef(null);
  const streamRef = useRef(null);

  const pick = async (file) => {
    setError("");
    try {
      setAvatar(await fileToSquareDataUrl(file));
    } catch (e) {
      setError(e.message || "ছবি প্রসেস করা যায়নি");
    }
  };

  const openCamera = async () => {
    setCamError("");
    setCamOpen(true);
    try {
      const stream = await navigator.mediaDevices.getUserMedia({
        video: { facingMode: "user", width: { ideal: 720 } },
        audio: false,
      });
      streamRef.current = stream;
      // wait a tick for <video> to mount
      requestAnimationFrame(() => {
        if (videoRef.current) videoRef.current.srcObject = stream;
      });
    } catch {
      setCamError("ক্যামেরা চালু হয়নি — ব্রাউজার পারমিশন দিন অথবা ফাইল আপলোড করুন।");
    }
  };

  const closeCamera = () => {
    stopStream(streamRef.current);
    streamRef.current = null;
    setCamOpen(false);
  };

  useEffect(() => () => stopStream(streamRef.current), []);

  return (
    <div className="flex flex-col gap-4 sm:flex-row sm:items-start">
      {/* Preview */}
      <div className="flex shrink-0 items-center gap-4">
        <div className="relative">
          {avatar ? (
            // eslint-disable-next-line @next/next/no-img-element
            <img
              src={avatar}
              alt="তোমার প্রোফাইল ছবি"
              className="h-28 w-28 rounded-full border-4 border-indigo-500 object-cover shadow-lg sm:h-32 sm:w-32"
            />
          ) : (
            <div className="flex h-28 w-28 items-center justify-center rounded-full border-4 border-dashed border-slate-300 bg-slate-100 text-4xl sm:h-32 sm:w-32 dark:border-white/15 dark:bg-white/5">
              🙂
            </div>
          )}
        </div>
        <div className="sm:hidden">
          <p className="font-extrabold text-slate-900 dark:text-white">
            {avatar ? "ছবি রেডি! ✅" : "ছবি দাও"}
          </p>
          <p className="text-xs text-slate-500 dark:text-slate-400">পোস্টারের উপরে বসবে</p>
        </div>
      </div>

      <div className="flex flex-1 flex-col gap-3">
        {/* Dropzone */}
        <div
          role="button"
          tabIndex={0}
          aria-label="ছবি আপলোড করো"
          onClick={() => fileRef.current?.click()}
          onKeyDown={(e) => e.key === "Enter" && fileRef.current?.click()}
          onDragOver={(e) => {
            e.preventDefault();
            setDrag(true);
          }}
          onDragLeave={() => setDrag(false)}
          onDrop={(e) => {
            e.preventDefault();
            setDrag(false);
            const f = e.dataTransfer.files?.[0];
            if (f) pick(f);
          }}
          className={cn(
            "cursor-pointer rounded-2xl border-2 border-dashed p-5 text-center transition-all",
            drag
              ? "border-indigo-500 bg-indigo-50 dark:bg-indigo-400/10"
              : "border-slate-300 bg-slate-50 hover:border-indigo-400 dark:border-white/15 dark:bg-white/5"
          )}
        >
          <p className="text-2xl" aria-hidden>
            📁
          </p>
          <p className="mt-1 text-sm font-extrabold text-slate-800 dark:text-slate-100">
            ট্যাপ করে গ্যালারি থেকে ছবি নাও <span className="font-medium">/ এখানে ড্র্যাগ করো</span>
          </p>
          <p className="text-xs text-slate-500 dark:text-slate-400">JPG / PNG • সর্বোচ্চ ৮MB</p>
          <input
            ref={fileRef}
            type="file"
            accept="image/*"
            className="hidden"
            onChange={(e) => {
              const f = e.target.files?.[0];
              if (f) pick(f);
              e.target.value = "";
            }}
          />
        </div>

        {error && (
          <p className="rounded-xl bg-rose-50 px-3 py-2 text-sm font-bold text-rose-600 dark:bg-rose-400/10 dark:text-rose-300">
            ⚠️ {error}
          </p>
        )}

        <div className="flex flex-col gap-2 sm:flex-row">
          <Button type="button" size="md" variant="outline" onClick={openCamera}>
            📷 ওয়েবক্যামে তুলুন
          </Button>
          {avatar && (
            <Button type="button" size="md" variant="ghost" onClick={() => setAvatar(null)}>
              🗑️ ছবি মুছুন
            </Button>
          )}
        </div>

        <div className="border-t border-slate-200 pt-3 dark:border-white/10">
          <OAuthButtons />
        </div>

        {/* Display name for poster */}
        <label className="flex flex-col gap-1">
          <span className="text-sm font-extrabold text-slate-700 dark:text-slate-200">
            পোস্টারে তোমার নাম (ঐচ্ছিক)
          </span>
          <input
            value={name}
            onChange={(e) => setName(e.target.value.slice(0, 30))}
            placeholder="যেমন: রহিম উদ্দিন"
            maxLength={30}
            className="h-12 rounded-2xl border-2 border-slate-200 bg-white px-4 text-sm font-bold text-slate-900 outline-none placeholder:font-medium placeholder:text-slate-400 focus:border-indigo-500 dark:border-white/10 dark:bg-white/5 dark:text-white"
          />
        </label>

        {/* Webcam modal */}
        {camOpen && (
          <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 p-4">
            <div className="w-full max-w-md rounded-3xl bg-white p-4 dark:bg-slate-900">
              <p className="mb-2 text-center font-extrabold text-slate-900 dark:text-white">
                📷 সেলফি তুলুন
              </p>
              {camError ? (
                <p className="rounded-xl bg-rose-50 px-3 py-3 text-center text-sm font-bold text-rose-600 dark:bg-rose-400/10 dark:text-rose-300">
                  {camError}
                </p>
              ) : (
                <video
                  ref={videoRef}
                  autoPlay
                  playsInline
                  muted
                  className="aspect-square w-full -scale-x-100 rounded-2xl bg-black object-cover"
                />
              )}
              <div className="mt-3 flex gap-2">
                {!camError && (
                  <Button
                    type="button"
                    size="md"
                    onClick={() => {
                      if (videoRef.current) {
                        setAvatar(videoToSquareDataUrl(videoRef.current));
                        closeCamera();
                      }
                    }}
                  >
                    📸 ক্যাপচার
                  </Button>
                )}
                <Button type="button" size="md" variant="outline" onClick={closeCamera}>
                  বন্ধ করুন
                </Button>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
