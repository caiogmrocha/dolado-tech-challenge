import { Inject, Injectable } from "@nestjs/common";

import { MovieReviewsRepository } from "@/app/interfaces/repositories/movie-reviews.repository";
import { MovieReviewNotFoundException } from "../errors/movie-review-not-found.exception";
import { MoviesRepository } from "@/app/interfaces/repositories/movies.repository";

export type UpdateMovieReviewServiceParams = {
  id: number;
  notes: string;
}

@Injectable()
export class UpdateMovieReviewService {
  constructor (
    @Inject(MovieReviewsRepository) private readonly movieReviewsRepository: MovieReviewsRepository
  ) {}

  public async execute(params: UpdateMovieReviewServiceParams): Promise<void> {
    const movieReview = await this.movieReviewsRepository.getById(params.id);

    if (!movieReview) {
      throw new MovieReviewNotFoundException(params.id);
    }

    return;
  }
}
