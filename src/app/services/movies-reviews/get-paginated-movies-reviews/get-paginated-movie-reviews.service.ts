import { MovieReviewsRepository } from "@/app/interfaces/repositories/movie-reviews.repository";
import { Inject } from "@nestjs/common";

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

  public async execute(): Promise<GetPaginatedMovieReviewsServiceResponse[]> {
    const movieReviews = await this.movieReviewsRepository.getPaginated();

    return movieReviews.map(movieReview => ({
      title: movieReview.movie.title,
      rating: movieReview.movie.rating,
      releasedAt: movieReview.movie.releasedAt,
      notes: movieReview.notes,
    }));
  }
}
