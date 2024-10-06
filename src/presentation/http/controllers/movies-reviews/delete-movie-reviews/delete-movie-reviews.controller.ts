import { DeleteMovieReviewService } from "@/app/services/movies-reviews/delete-movie-review/delete-movie-review.service";
import { Inject } from "@nestjs/common";

export class DeleteMovieReviewController {
  constructor (
    private readonly deleteMovieReviewService: DeleteMovieReviewService,
  ) {}

  public async handle(id: number): Promise<void> {
    return;
  }
}
