import { MovieReview } from "@/domain/entities/movie-review.entity";

export interface MovieReviewsRepository {
  getAll(): Promise<MovieReview[]>;
  getByTitle(title: string): Promise<MovieReview | null>;
  create(movieReview: MovieReview): Promise<{ id: number }>;
}

export const MovieReviewsRepository = Symbol('MovieReviewsRepository');
