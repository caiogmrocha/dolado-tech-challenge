import { Inject, Injectable } from "@nestjs/common";

import { MovieReviewTitleAlreadyExistsException } from "../errors/movie-review-title-already-exists.exception";
import { MoviesReviewsRepository } from "@/app/interfaces/repositories/movies-reviews.repository";
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
    @Inject(MoviesReviewsRepository) private readonly moviesReviewsRepository: MoviesReviewsRepository,
    @Inject(MovieInfoProvider) private readonly movieInfoProvider: MovieInfoProvider,
  ) {}

  public async execute(params: CreateMovieReviewServiceParams): Promise<CreateMovieReviewServiceResponse> {
    let movieReview = await this.moviesReviewsRepository.getByTitle(params.title);

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

    const { id } = await this.moviesReviewsRepository.create(movieReview);

    return { reviewId: id };
  }
}
