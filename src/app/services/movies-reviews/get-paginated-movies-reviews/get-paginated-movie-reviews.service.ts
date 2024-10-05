import { Inject } from "@nestjs/common";

import { MovieReviewsRepository } from "@/app/interfaces/repositories/movie-reviews.repository";

export type GetPaginatedMovieReviewsServiceParams = {
  limit: number;
  offset: number;
  filterByTitle?: string;
  filterByAuthor?: string;
  orderBy?: 'rating' | 'releasedAt';
  order?: 'asc' | 'desc';
}

export type GetPaginatedMovieReviewsServiceResponse = {
  title: string;
  rating: number;
  releasedAt: Date;
  notes: string;
}

export class GetPaginatedMovieReviewsService {
  constructor (
    @Inject(MovieReviewsRepository) private readonly movieReviewsRepository: MovieReviewsRepository
  ) {}

  public async execute(params: GetPaginatedMovieReviewsServiceParams): Promise<GetPaginatedMovieReviewsServiceResponse[]> {
    const movieReviews = await this.movieReviewsRepository.getPaginated(params);

    return movieReviews.map(movieReview => ({
      title: movieReview.movie.title,
      rating: movieReview.movie.rating,
      releasedAt: movieReview.movie.releasedAt,
      notes: movieReview.notes,
    }));
  }
}
