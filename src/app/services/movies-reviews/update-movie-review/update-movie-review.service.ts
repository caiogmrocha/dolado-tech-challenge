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
    @Inject(MoviesRepository) private readonly moviesRepository: MoviesRepository,
    @Inject(MovieReviewsRepository) private readonly movieReviewsRepository: MovieReviewsRepository
  ) {}

  public async execute(params: UpdateMovieReviewServiceParams): Promise<void> {
    return;
  }
}
