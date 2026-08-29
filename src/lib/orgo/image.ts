import { API_URL } from "./api";

export function resolveImage(path?: string) {
  if (!path) return "";
  if (path.startsWith("/uploads/") || path.startsWith("http")) return path.startsWith("http") ? path : `${API_URL}${path}`;
  return path;
}