import { MovieReview } from "@/domain/entities/movie-review.entity";

export interface MoviesReviewsRepository {
  getByTitle(title: string): Promise<MovieReview | null>;
  create(movieReview: MovieReview): Promise<{ id: number }>;
}

export const MoviesReviewsRepository = Symbol('MoviesReviewsRepository');
