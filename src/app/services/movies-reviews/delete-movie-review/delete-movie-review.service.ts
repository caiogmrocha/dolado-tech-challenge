import { MovieReviewsRepository } from "@/app/interfaces/repositories/movie-reviews.repository";
import { Inject, Injectable } from "@nestjs/common";

@Injectable()
export class DeleteMovieReviewService {
  constructor (
    @Inject(MovieReviewsRepository) private readonly movieReviewsRepository: MovieReviewsRepository
  ) {}

  public async execute(movieReviewId: string): Promise<void> {
    return;
  }
}
