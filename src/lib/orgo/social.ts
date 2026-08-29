export const INSTAGRAM_HANDLE = "@orgo.farm_";
export const INSTAGRAM_URL = "https://www.instagram.com/orgo.farm_/";

export type InstaPost = { code: string; kind: "reel" | "p"; alt: string };

// Keeps the Instagram page useful before the catalogue API has any entries.
// Add future posts from the admin panel; those take precedence when available.
export const INSTAGRAM_POSTS: InstaPost[] = [
  {
    code: "DcV1KihMH4L",
    kind: "reel",
    alt: "ORGO FARM reel",
  },
];
