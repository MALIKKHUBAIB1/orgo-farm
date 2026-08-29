const SESSION_KEY = "orgo-session-key";

export function getSessionKey(): string {
  if (typeof window === "undefined") return "";
  let key = window.localStorage.getItem(SESSION_KEY);
  if (!key) {
    key =
      typeof crypto.randomUUID === "function"
        ? crypto.randomUUID()
        : `s-${Date.now()}-${Math.random().toString(36).slice(2)}`;
    window.localStorage.setItem(SESSION_KEY, key);
  }
  return key;
}
