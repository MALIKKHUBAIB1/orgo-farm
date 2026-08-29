import { API_URL, ApiError } from "./api";

const TOKEN_KEY = "orgo-admin-token";

export type AdminUser = { id: string; name: string; email: string };

export function getAdminToken() {
  if (typeof window === "undefined") return "";
  return localStorage.getItem(TOKEN_KEY) ?? "";
}

export function setAdminToken(token: string) {
  if (typeof window === "undefined") return;
  if (token) localStorage.setItem(TOKEN_KEY, token);
  else localStorage.removeItem(TOKEN_KEY);
}

export async function adminFetch<T>(path: string, init?: RequestInit): Promise<T> {
  const token = getAdminToken();
  let res: Response;
  try {
    res = await fetch(`${API_URL}${path}`, {
      ...init,
      headers: {
        "Content-Type": "application/json",
        ...(token ? { Authorization: `Bearer ${token}` } : {}),
        ...(init?.headers ?? {}),
      },
    });
  } catch (err) {
    console.error("[admin] network error:", path, err);
    throw new ApiError("We couldn't reach the server. Please try again.");
  }
  const data: unknown = await res.json().catch(() => null);
  if (!res.ok) {
    const msg =
      data && typeof data === "object" && "error" in data && typeof data.error === "string"
        ? data.error
        : `Request failed (${res.status})`;
    if (res.status === 401) setAdminToken("");
    throw new ApiError(msg);
  }
  return data as T;
}

export async function adminLogin(email: string, password: string) {
  const data = await adminFetch<{ token: string; admin: AdminUser }>("/api/admin/auth/login", {
    method: "POST",
    body: JSON.stringify({ email, password }),
  });
  setAdminToken(data.token);
  return data.admin;
}

export async function adminMe(): Promise<AdminUser | null> {
  const token = getAdminToken();
  if (!token) return null;
  try {
    const admin = await adminFetch<AdminUser>("/api/admin/auth/me");
    return admin;
  } catch {
    return null;
  }
}

export function adminLogout() {
  setAdminToken("");
}

export async function adminUploadImage(file: File, folder = "/products"): Promise<string> {
  const token = getAdminToken();
  if (!token) throw new ApiError("Admin login required");
  const auth: { publicKey: string; token: string; expire: number; signature: string } = await adminFetch(
    "/api/uploads/token",
  );
  const form = new FormData();
  form.append("apiKey", auth.publicKey);
  form.append("file", file);
  form.append("fileName", file.name);
  form.append("folder", folder);
  form.append("token", auth.token);
  form.append("expire", String(auth.expire));
  form.append("signature", auth.signature);
  const res = await fetch("https://upload.imagekit.io/api/v1/files/upload", { method: "POST", body: form });
  const data: unknown = await res.json().catch(() => null);
  if (!res.ok) {
    const msg =
      data && typeof data === "object" && "error" in data && typeof data.error === "string"
        ? data.error
        : "Upload failed";
    throw new ApiError(msg);
  }
  const url =
    data && typeof data === "object" && "url" in data && typeof data.url === "string" ? data.url : "";
  if (!url) throw new ApiError("Upload failed");
  return url;
}