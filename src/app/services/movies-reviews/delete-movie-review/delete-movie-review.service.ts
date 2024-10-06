import { MovieReviewsRepository } from "@/app/interfaces/repositories/movie-reviews.repository";
import { Inject, Injectable } from "@nestjs/common";
import { MovieReviewNotFoundException } from "../errors/movie-review-not-found.exception";

export type DeleteMovieReviewServiceParams = {
  id: number;
}

@Injectable()
export class DeleteMovieReviewService {
  constructor (
    @Inject(MovieReviewsRepository) private readonly movieReviewsRepository: MovieReviewsRepository
  ) {}

  public async execute(params: DeleteMovieReviewServiceParams): Promise<void> {
    const movieReview = await this.movieReviewsRepository.getById(params.id);

    if (!movieReview) {
      throw new MovieReviewNotFoundException(params.id);
    }
  }
}
