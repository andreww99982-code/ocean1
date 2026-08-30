/**
 * Thin wrapper over localStorage. All app data (orders, cart)
 * is stored only on the user's device — no network requests.
 */
const PREFIX = "aquarium-tickets:";

export function readJSON<T>(key: string, fallback: T): T {
  try {
    const raw = window.localStorage.getItem(PREFIX + key);
    if (!raw) return fallback;
    return JSON.parse(raw) as T;
  } catch {
    return fallback;
  }
}

export function writeJSON<T>(key: string, value: T): void {
  try {
    window.localStorage.setItem(PREFIX + key, JSON.stringify(value));
  } catch {
    // Storage is unavailable (private mode, etc.) — silently ignore.
  }
}
