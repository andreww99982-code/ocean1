/**
 * Тонкая обёртка над localStorage. Все данные приложения (заказы, корзина)
 * хранятся только на устройстве пользователя — никаких сетевых запросов.
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
    // Хранилище недоступно (приватный режим и т.п.) — тихо игнорируем.
  }
}
