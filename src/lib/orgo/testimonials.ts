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

export const fallbackTestimonials: Testimonial[] = [
  {
    _id: "fb-1",
    name: "Verified Customer",
    quote: "Honest, natural products that actually work. My skin has never felt better.",
    product: "Signature Face Pack Pouch",
    rating: 5,
    avatar: "",
    sortOrder: 0,
    visible: true,
  },
];