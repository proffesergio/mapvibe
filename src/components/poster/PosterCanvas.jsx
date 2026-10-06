"use client";

import { FEATURE_TABS } from "@/data/tiers";
import { slangBadgeText } from "@/data/slangs";
import { DECADES, NOSTALGIA_MEMORIES, nostalgiaBadgeText } from "@/data/games";
import { getAllGames, getSlangs } from "@/lib/adminData";
import { loadJSON } from "@/lib/storage";
import { districtById } from "@/data/districts";
import { explorerBadgeText, getRankTier, toBnDigits } from "@/lib/rank";
import { RealBdMap } from "@/components/map/RealBdMap";
import { BdFlag } from "@/components/ui/BdFlag";

const THEMES = {
  slang: { bg: "#faf5ff", ink: "#1e1b4b", accent: "#7c3aed", soft: "#ede9fe" },
  nostalgia: { bg: "#f4ebe1", ink: "#4a3728", accent: "#b45309", soft: "#e7d9c4" },
  "nostalgia-80s": { bg: "#e8e4da", ink: "#3a3a32", accent: "#57534e", soft: "#d6d0bf" },
  "nostalgia-dark": { bg: "#111827", ink: "#f9fafb", accent: "#fbbf24", soft: "#1f2937" },
  games: { bg: "#ecfdf5", ink: "#064e3b", accent: "#059669", soft: "#d1fae5" },
  explorer: { bg: "#fffbeb", ink: "#451a03", accent: "#d97706", soft: "#fef3c7" },
};

function Avatar({ src, ring }) {
  return (
    <div
      style={{
        width: 220,
        height: 220,
        borderRadius: 9999,
        border: `10px solid ${ring}`,
        overflow: "hidden",
        background: "#e2e8f0",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        fontSize: 96,
        flexShrink: 0,
      }}
    >
      {src ? (
        // eslint-disable-next-line @next/next/no-img-element
        <img src={src} alt="" style={{ width: "100%", height: "100%", objectFit: "cover" }} />
      ) : (
        <span>🙂</span>
      )}
    </div>
  );
}

function Chip({ label, dark }) {
  return (
    <span
      style={{
        display: "inline-block",
        padding: "10px 22px",
        borderRadius: 9999,
        fontSize: 30,
        fontWeight: 700,
        background: dark ? "rgba(255,255,255,0.15)" : "rgba(0,0,0,0.06)",
      }}
    >
      {label}
    </span>
  );
}

/** Compact chip so ALL picked phrases fit on the 1080 poster. */
function ChipSm({ label, dark }) {
  return (
    <span
      style={{
        display: "inline-block",
        padding: "7px 16px",
        borderRadius: 9999,
        fontSize: 26,
        fontWeight: 700,
        background: dark ? "rgba(255,255,255,0.15)" : "rgba(0,0,0,0.06)",
      }}
    >
      {label}
    </span>
  );
}

/**
 * Pixel-perfect 1080x1080 poster. Fixed px sizes + explicit colors only
 * (no responsive / dark-mode classes) so html-to-image export is exact.
 */
export function PosterCanvas({ tab, snap, innerRef }) {
  const meta = FEATURE_TABS.find((t) => t.id === tab) ?? FEATURE_TABS[0];
  const name = snap.name?.trim() || "আমি";
  const dark = tab === "nostalgia" && snap.decadeId === "2010s";
  const is80s = tab === "nostalgia" && snap.decadeId === "80s";
  const th = dark ? THEMES["nostalgia-dark"] : is80s ? THEMES["nostalgia-80s"] : THEMES[tab] ?? THEMES.slang;
  // Admin-aware content (re-read each render; PosterSection re-renders on change events)
  const slangs = getSlangs();
  const regionMap = loadJSON("slang-picked-regions", {});
  const allGames = getAllGames();
  const memoryById = (id) => NOSTALGIA_MEMORIES.find((m) => m.id === id);

  let badge = "";
  let activeIds = [];
  let accent = th.accent;

  if (tab === "slang") {
    badge = snap.slangPicked.length ? slangBadgeText(snap.slangPicked.length) : "সার্টিফাইড ভাষা যাযাবর!";
    activeIds = [
      ...new Set(
        snap.slangPicked
          .map((id) => slangs.find((s) => String(s.id) === String(id))?.regionId ?? regionMap[id])
          .filter(Boolean)
      ),
    ];
  } else if (tab === "nostalgia") {
    const decade = DECADES.find((d) => d.id === snap.decadeId) ?? DECADES[0];
    const dist = snap.districtId ? districtById(snap.districtId) : null;
    badge = dist ? nostalgiaBadgeText(decade.label, dist.name) : `${decade.label}-এর শৈশব!`;
    activeIds = snap.districtId ? [snap.districtId] : [];
    accent = dark ? "#fbbf24" : is80s ? "#57534e" : "#b45309";
  } else if (tab === "games") {
    const n = snap.gamesPicked.length;
    badge = n ? `আসল ৯০s কিড! আমি ${toBnDigits(n)}টি খেলা খেলেছি।` : "ছোটবেলার খেলার রাজা!";
  } else {
    const tier = getRankTier(snap.visited.length);
    badge = explorerBadgeText(snap.visited.length);
    activeIds = snap.visited;
    void tier;
  }

  const pickedGames = allGames.filter((g) => snap.gamesPicked.includes(g.id)).slice(0, 8);
  const regionNames = activeIds.map((id) => districtById(id)?.name).filter(Boolean).slice(0, 8);
  const pickedMemories = (snap.nostalgiaMemories ?? []).map(memoryById).filter(Boolean).slice(0, 6);
  const storyLine = (snap.nostalgiaStory ?? "").trim().slice(0, 120);
  // All picked phrases for the Language poster: public-feed snapshot first,
  // local seed list as fallback (covers pre-DB picks).
  const pickedDetails = loadJSON("slang-picked-details", []);
  const pickedPhrases =
    tab === "slang"
      ? snap.slangPicked
          .map((id) => {
            const snap_hit = pickedDetails.find((d) => String(d.id) === String(id));
            if (snap_hit?.phrase) return snap_hit;
            const local = slangs.find((s) => String(s.id) === String(id));
            return local
              ? { id, phrase: local.phrase, meaning: local.meaning, districtId: local.regionId, upazila: "" }
              : null;
          })
          .filter(Boolean)
      : [];
  const slangMapH =
    pickedPhrases.length === 0 ? 560 : pickedPhrases.length <= 4 ? 420 : pickedPhrases.length <= 9 ? 320 : 220;

  return (
    <div
      ref={innerRef}
      style={{
        width: 1080,
        height: 1080,
        background: th.bg,
        color: th.ink,
        padding: 64,
        display: "flex",
        flexDirection: "column",
        fontFamily: "var(--font-hind), var(--font-inter), sans-serif",
      }}
    >
      {/* Brand bar */}
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
        <span style={{ fontSize: 36, fontWeight: 800 }}>🗺️ ম্যাপভাইব</span>
        <span style={{ fontSize: 32, fontWeight: 700, background: th.soft, padding: "8px 24px", borderRadius: 9999 }}>
          {meta.emoji} {meta.label}
        </span>
      </div>

      {/* Identity */}
      <div style={{ display: "flex", alignItems: "center", gap: 36, marginTop: 40 }}>
        <div style={{ position: "relative" }}>
          <Avatar src={snap.avatar} ring={accent} />
          {tab === "explorer" && (
            <span style={{ position: "absolute", right: -6, bottom: 6, fontSize: 64 }}>
              {getRankTier(snap.visited.length).badgeEmoji}
            </span>
          )}
        </div>
        <div>
          <div style={{ fontSize: 64, fontWeight: 800, lineHeight: 1.15 }}>{name}</div>
          <div style={{ fontSize: 34, fontWeight: 700, opacity: 0.75 }}>{meta.headline}</div>
        </div>
      </div>

      {/* Badge */}
      <div
        style={{
          marginTop: 36,
          background: accent,
          color: "#ffffff",
          borderRadius: 32,
          padding: "28px 36px",
          fontSize: 40,
          fontWeight: 800,
          lineHeight: 1.4,
        }}
      >
        {badge}
      </div>

      {/* Body */}
      <div style={{ marginTop: 32, flex: 1, display: "flex", flexDirection: "column", gap: 20 }}>
        {tab === "games" ? (
          <div style={{ display: "flex", flexWrap: "wrap", gap: 14 }}>
            {pickedGames.length ? (
              pickedGames.map((g) => <Chip key={g.id} label={`🪁 ${g.name}`} dark={dark} />)
            ) : (
              <span style={{ fontSize: 32, opacity: 0.7 }}>খেলা সিলেক্ট করো 👆</span>
            )}
          </div>
        ) : tab === "nostalgia" ? (
          <>
            {storyLine ? (
              <div style={{ fontSize: 32, fontStyle: "italic", lineHeight: 1.4, opacity: 0.9 }}>
                “{storyLine}”
              </div>
            ) : null}
            <div style={{ background: dark ? "#0b1220" : "#ffffff", borderRadius: 28, padding: 24, height: pickedMemories.length ? 440 : 560, display: "flex", justifyContent: "center" }}>
              <RealBdMap
                activeIds={activeIds}
                activeFill={accent}
                idleFill={dark ? "#243044" : "#e8e2d5"}
                labelFill={dark ? "#f9fafb" : "#1f2937"}
                labelHalo={dark ? "#0b1220" : "#ffffff"}
                labelLimit={20}
                className="h-full w-auto"
              />
            </div>
            {pickedMemories.length > 0 && (
              <div style={{ display: "flex", flexWrap: "wrap", gap: 12 }}>
                {pickedMemories.map((m) => (
                  <Chip key={m.id} label={`${m.emoji} ${m.label}`} dark={dark} />
                ))}
              </div>
            )}
          </>
        ) : tab === "slang" ? (
          <>
            <div style={{ background: "#ffffff", borderRadius: 28, padding: 20, height: slangMapH, display: "flex", justifyContent: "center" }}>
              <RealBdMap
                activeIds={activeIds}
                activeFill={accent}
                idleFill="#e8e2d5"
                labelFill="#1f2937"
                labelHalo="#ffffff"
                labelLimit={20}
                className="h-full w-auto"
              />
            </div>
            {pickedPhrases.length > 0 ? (
              <div style={{ display: "flex", flexWrap: "wrap", gap: 10 }}>
                {pickedPhrases.map((p) => (
                  <ChipSm key={p.id} label={`🗣️ ${p.phrase}`} dark={dark} />
                ))}
              </div>
            ) : (
              <span style={{ fontSize: 32, opacity: 0.7 }}>ভাষা সিলেক্ট করো 👆</span>
            )}
          </>
        ) : (
          <>
            <div style={{ background: dark ? "#0b1220" : "#ffffff", borderRadius: 28, padding: 24, height: 560, display: "flex", justifyContent: "center" }}>
              <RealBdMap
                activeIds={activeIds}
                activeFill={accent}
                idleFill={dark ? "#243044" : "#e8e2d5"}
                labelFill={dark ? "#f9fafb" : "#1f2937"}
                labelHalo={dark ? "#0b1220" : "#ffffff"}
                labelLimit={20}
                className="h-full w-auto"
              />
            </div>
            {regionNames.length > 0 && (
              <div style={{ display: "flex", flexWrap: "wrap", gap: 12 }}>
                {regionNames.map((n) => (
                  <Chip key={n} label={`📍 ${n}`} dark={dark} />
                ))}
                {activeIds.length > 8 && <Chip label={`+${toBnDigits(activeIds.length - 8)}`} dark={dark} />}
              </div>
            )}
          </>
        )}
      </div>

      {/* Footer */}
      <div
        style={{
          marginTop: 24,
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          fontSize: 28,
          fontWeight: 700,
          opacity: 0.8,
        }}
      >
        <span style={{ display: "flex", alignItems: "center", gap: 12 }}>
          <BdFlag size={40} rounded={6} /> ১ মিনিটে বানাও • ফেসবুকে শেয়ার করো
        </span>
        <span>mapvibe</span>
      </div>
    </div>
  );
}
