import { MovieReview } from "@/domain/entities/movie-review.entity";

export type MovieReviewsRepositoryGetPaginatedParams = {
  limit: number;
  offset: number;
  filterByTitle?: string;
  filterByAuthor?: string;
  orderBy?: 'rating' | 'releasedAt';
  order?: 'asc' | 'desc';
}

export interface MovieReviewsRepository {
  getPaginated(params: MovieReviewsRepositoryGetPaginatedParams): Promise<MovieReview[]>;
  getById(id: number): Promise<MovieReview | null>;
  getByTitle(title: string): Promise<MovieReview | null>;
  create(movieReview: MovieReview): Promise<{ id: number }>;
}

export const MovieReviewsRepository = Symbol('MovieReviewsRepository');
