"use client";

import { useEffect, useState } from "react";
import { loadJSON } from "@/lib/storage";

function readAll() {
  return {
    avatar: loadJSON("avatar", null),
    name: loadJSON("display-name", ""),
    slangPicked: loadJSON("slang-picked", []),
    decadeId: loadJSON("nostalgia-decade", "90s"),
    districtId: loadJSON("nostalgia-district", null),
    nostalgiaMemories: loadJSON("nostalgia-memories", []),
    nostalgiaStory: loadJSON("nostalgia-story", ""),
    gamesPicked: loadJSON("games-picked", []),
    customGames: loadJSON("games-custom", []),
    visited: loadJSON("explorer-visited", []),
  };
}

/** Reactive snapshot of all studio state for the poster preview. */
export function useStudioSnapshot() {
  const [snap, setSnap] = useState(readAll);

  useEffect(() => {
    setSnap(readAll());
    const onChange = () => setSnap(readAll());
    window.addEventListener("vibemap:change", onChange);
    return () => window.removeEventListener("vibemap:change", onChange);
  }, []);

  return snap;
}
