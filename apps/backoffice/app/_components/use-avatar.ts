"use client";

// The signed-in person's avatar, shared by the Settings form and the top bar.
//
// **Where the file actually goes.** This app is a static export, so there is no
// server to write into `public/` and no upload endpoint. The demo therefore
// stores the picked image as a data URI in localStorage: it survives a reload
// and shows everywhere the avatar appears, which is what you want to see when
// evaluating the UI.
//
// In a real app you replace one function. `saveAvatar` becomes the call to your
// API, which writes the file (to `public/avatars/…`, S3, wherever) and returns
// its URL; you store that URL instead of the data URI. Nothing else changes,
// because every consumer reads `useAvatar()` and gets a string either way.
//
//   async function saveAvatar(file: File) {
//     const body = new FormData();
//     body.append("avatar", file);
//     const res = await fetch("/api/avatar", { method: "POST", body });
//     const { url } = await res.json();
//     return url;
//   }

import * as React from "react";

const KEY = "vui.avatar";

/** Data URIs are big; refuse anything that would bloat localStorage. */
export const AVATAR_MAX_BYTES = 512 * 1024;

let current = "";
const listeners = new Set<() => void>();

function emit() {
  listeners.forEach((l) => l());
}

export function setAvatar(url: string) {
  current = url;
  try {
    if (url) localStorage.setItem(KEY, url);
    else localStorage.removeItem(KEY);
  } catch {
    // storage unavailable or full (a large image in private mode) — in-memory only
  }
  emit();
}

/**
 * The current avatar URL, or "" when there is none. Every surface reads this, so
 * changing it in Settings updates the top bar without prop drilling.
 */
export function useAvatar(): string {
  const value = React.useSyncExternalStore(
    React.useCallback((cb: () => void) => {
      listeners.add(cb);
      return () => void listeners.delete(cb);
    }, []),
    () => current,
    () => "", // the server has no storage, so it renders the placeholder
  );

  React.useEffect(() => {
    let stored = "";
    try {
      stored = localStorage.getItem(KEY) ?? "";
    } catch {
      // storage unavailable — the placeholder is a fine default
    }
    if (stored && stored !== current) {
      current = stored;
      emit();
    }
  }, []);

  return value;
}
