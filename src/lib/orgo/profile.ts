import { apiFetch } from "./api";

export type ProfileAddress = { address: string; city: string; state: string; pin: string };
export type SavedAddress = ProfileAddress & { id: string };
export type ProfileData = { name: string; email: string; phone: string; address: ProfileAddress; addresses: SavedAddress[] };
type ProfileUpdate = Omit<ProfileData, "addresses"> & { addresses?: SavedAddress[] };

export const emptyProfile: ProfileData = {
  name: "",
  email: "",
  phone: "",
  address: { address: "", city: "", state: "", pin: "" },
  addresses: [],
};

export function loadProfile(key: string): Promise<ProfileData> {
  return apiFetch<ProfileData>(`/api/profile/${encodeURIComponent(key)}`);
}

export function saveProfileData(key: string, data: ProfileUpdate): Promise<ProfileData> {
  return apiFetch<ProfileData>(`/api/profile/${encodeURIComponent(key)}`, {
    method: "PUT",
    body: JSON.stringify(data),
  });
}
