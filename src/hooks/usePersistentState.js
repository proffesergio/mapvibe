"use client";

import { useEffect, useRef, useState } from "react";
import { loadJSON, saveJSON } from "@/lib/storage";

/** useState persisted to localStorage (zero-DB). Loads once on mount. */
export function usePersistentState(key, initial) {
  const [value, setValue] = useState(initial);
  const loaded = useRef(false);

  useEffect(() => {
    setValue(loadJSON(key, initial));
    loaded.current = true;
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [key]);

  useEffect(() => {
    if (!loaded.current) return;
    saveJSON(key, value);
    // Notify same-tab listeners (e.g. poster preview) of the change.
    window.dispatchEvent(new Event("mapvibe:change"));
  }, [key, value]);

  return [value, setValue];
}
