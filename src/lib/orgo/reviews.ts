import { API_URL, ApiError } from "./api";

export type Review = {
  id: string;
  name: string;
  rating: number;
  title: string;
  comment: string;
  createdAt: string;
};

export type ReviewSummary = {
  count: number;
  avg: number;
  dist: [number, number, number, number, number]; // index 0 = 1-star count …
};

export function summarizeReviews(reviews: Review[]): ReviewSummary {
  const dist: [number, number, number, number, number] = [0, 0, 0, 0, 0];
  let sum = 0;
  for (const r of reviews) {
    if (r.rating >= 1 && r.rating <= 5) {
      dist[r.rating - 1] += 1;
      sum += r.rating;
    }
  }
  return {
    count: reviews.length,
    avg: reviews.length ? Math.round((sum / reviews.length) * 10) / 10 : 0,
    dist,
  };
}

export function formatReviewDate(iso: string): string {
  const d = new Date(iso);
  if (Number.isNaN(d.getTime())) return "";
  return d.toLocaleDateString("en-IN", { day: "numeric", month: "short", year: "numeric" });
}

async function parseError(res: Response): Promise<never> {
  const data: unknown = await res.json().catch(() => null);
  const msg =
    data && typeof data === "object" && "error" in data && typeof data.error === "string"
      ? data.error
      : `Request failed (${res.status})`;
  throw new ApiError(msg);
}

export async function getReviews(slug: string): Promise<Review[]> {
  let res: Response;
  try {
    res = await fetch(`${API_URL}/api/reviews/${encodeURIComponent(slug)}`);
  } catch {
    return [];
  }
  if (!res.ok) return [];
  const data: unknown = await res.json().catch(() => []);
  return Array.isArray(data) ? (data as Review[]) : [];
}

export async function submitReview(
  slug: string,
  input: { name: string; rating: number; title: string; comment: string },
): Promise<Review> {
  let res: Response;
  try {
    res = await fetch(`${API_URL}/api/reviews/${encodeURIComponent(slug)}`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(input),
    });
  } catch {
    throw new ApiError("We couldn't reach the server. Please try again in a moment.");
  }
  if (!res.ok) await parseError(res);
  return (await res.json()) as Review;
}
