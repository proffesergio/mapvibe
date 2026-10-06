import { LEADERBOARD_TIERS } from "@/data/tiers";

/** Return the rank tier matching a visited-district count. */
export function getRankTier(count) {
  const n = Math.max(0, Number(count) || 0);
  return (
    LEADERBOARD_TIERS.find((t) => n >= t.minCount && n <= t.maxCount) ??
    LEADERBOARD_TIERS[0]
  );
}

/** Bangla badge line for explorer poster. */
export function explorerBadgeText(count) {
  const tier = getRankTier(count);
  return `${tier.badgeEmoji} ${tier.title} — ${toBnDigits(count)}টি জেলা ঘোরা!`;
}

/** Convert latin digits to Bengali digits for poster copy. */
export function toBnDigits(value) {
  const map = ["০", "১", "২", "৩", "৪", "৫", "৬", "৭", "৮", "৯"];
  return String(value).replace(/[0-9]/g, (d) => map[Number(d)]);
}
