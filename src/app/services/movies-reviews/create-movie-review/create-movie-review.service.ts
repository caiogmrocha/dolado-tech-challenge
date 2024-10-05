import { Inject, Injectable } from "@nestjs/common";

import { MovieReviewTitleAlreadyExistsException } from "../errors/movie-review-title-already-exists.exception";
import { MoviesReviewsRepository } from "@/app/interfaces/repositories/movies-reviews.repository";
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
  ) {}

  public async execute(params: CreateMovieReviewServiceParams): Promise<CreateMovieReviewServiceResponse> {
    let movieReview = await this.moviesReviewsRepository.getByTitle(params.title);

    if (movieReview) {
      throw new MovieReviewTitleAlreadyExistsException(movieReview.id);
    }

    return;
  }
}
