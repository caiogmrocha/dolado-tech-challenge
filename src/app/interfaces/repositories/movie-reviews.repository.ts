import { MovieReview } from "@/domain/entities/movie-review.entity";

export type MovieReviewsRepositoryGetPaginatedParams = {
  orderBy: 'rating' | 'releasedAt';
  order: 'asc' | 'desc';
  limit: number;
  offset: number;
}

export interface MovieReviewsRepository {
  getPaginated(): Promise<MovieReview[]>;
  getByTitle(title: string): Promise<MovieReview | null>;
  create(movieReview: MovieReview): Promise<{ id: number }>;
}

export const MovieReviewsRepository = Symbol('MovieReviewsRepository');
