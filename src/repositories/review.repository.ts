import type { RatingSummary, Review } from "@/models";

/** Acceso a las reseñas de pacientes. */
export interface ReviewRepository {
  findAll(): Review[];
  rating(): RatingSummary;
}

export function createInMemoryReviewRepository(reviews: readonly Review[], rating: RatingSummary): ReviewRepository {
  return {
    findAll: () => [...reviews],
    rating: () => rating,
  };
}
