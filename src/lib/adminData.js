import { GAMES } from "@/data/games";
import { SLANGS } from "@/data/slangs";
import { loadJSON, removeKey, saveJSON } from "@/lib/storage";

function broadcast() {
  if (typeof window !== "undefined") window.dispatchEvent(new Event("mapvibe:change"));
}

/** Admin overrides (this device) merged over the built-in dataset. */
export const getSlangs = () => loadJSON("admin-slangs", SLANGS);
export const getBaseGames = () => loadJSON("admin-games", GAMES);
export const getAllGames = () => [...getBaseGames(), ...loadJSON("games-custom", [])];

export function saveSlangs(list) {
  saveJSON("admin-slangs", list);
  broadcast();
}
export function saveBaseGames(list) {
  saveJSON("admin-games", list);
  broadcast();
}
export function resetSlangs() {
  removeKey("admin-slangs");
  broadcast();
}
export function resetBaseGames() {
  removeKey("admin-games");
  broadcast();
}

export function exportDataset() {
  return JSON.stringify(
    { slangs: getSlangs(), games: getBaseGames(), exportedAt: new Date().toISOString() },
    null,
    2
  );
}
