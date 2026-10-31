import { apiFetch } from "./api";

export type Testimonial = {
  _id: string;
  name: string;
  quote: string;
  product: string;
  rating: number;
  avatar: string;
  sortOrder: number;
  visible: boolean;
};

export async function getTestimonials(): Promise<Testimonial[]> {
  try {
    return await apiFetch<Testimonial[]>("/api/testimonials");
  } catch {
    return [];
  }
}

export const fallbackTestimonials: Testimonial[] = [];