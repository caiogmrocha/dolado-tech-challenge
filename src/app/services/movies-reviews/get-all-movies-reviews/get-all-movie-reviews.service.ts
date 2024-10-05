import { MovieReviewsRepository } from "@/app/interfaces/repositories/movie-reviews.repository";
import { Inject } from "@nestjs/common";

export type GetAllMovieReviewsServiceResponse = {
  title: string;
  rating: number;
  releasedAt: Date;
  notes: string;
}

export class GetAllMovieReviewsService {
  constructor (
    @Inject(MovieReviewsRepository) private readonly movieReviewsRepository: MovieReviewsRepository
  ) {}

  public async execute(): Promise<GetAllMovieReviewsServiceResponse[]> {
    const movieReviews = await this.movieReviewsRepository.getAll();

    return movieReviews.map(movieReview => ({
      title: movieReview.title,
      rating: movieReview.rating,
      releasedAt: movieReview.releasedAt,
      notes: movieReview.notes,
    }));
  }
}
