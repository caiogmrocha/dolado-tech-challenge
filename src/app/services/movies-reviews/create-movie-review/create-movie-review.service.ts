import { Inject, Injectable } from "@nestjs/common";

import { MovieReviewTitleAlreadyExistsException } from "../errors/movie-review-title-already-exists.exception";
import { MovieReviewsRepository } from "@/app/interfaces/repositories/movie-reviews.repository";
import { MovieInfoProvider } from "@/app/interfaces/api/movie-info.provider";
import { MovieReview } from "@/domain/entities/movie-review.entity";

type CreateMovieReviewServiceParams = {
  title: string;
  notes: string;
}

type CreateMovieReviewServiceResponse = {
  reviewId: number;
};

@Injectable()
export class CreateMovieReviewService {
  constructor (
    @Inject(MovieReviewsRepository) private readonly movieReviewsRepository: MovieReviewsRepository,
    @Inject(MovieInfoProvider) private readonly movieInfoProvider: MovieInfoProvider,
  ) {}

  public async execute(params: CreateMovieReviewServiceParams): Promise<CreateMovieReviewServiceResponse> {
    let movieReview = await this.movieReviewsRepository.getByTitle(params.title);

    if (movieReview) {
      throw new MovieReviewTitleAlreadyExistsException(movieReview.id);
    }

    const movieInfo = await this.movieInfoProvider.getMovieInfo(params.title);

    movieReview = new MovieReview({
      title: params.title,
      rating: movieInfo.rating,
      releasedAt: movieInfo.releasedAt,
      notes: params.notes,
    });

    const { id } = await this.movieReviewsRepository.create(movieReview);

    return { reviewId: id };
  }
}
