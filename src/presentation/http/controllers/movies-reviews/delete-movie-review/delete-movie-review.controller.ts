import { Controller, Delete, Inject, InternalServerErrorException, NotFoundException, Param } from "@nestjs/common";

import { DeleteMovieReviewControllerRequestParamsDto } from "./delete-movie-review.dto";
import { DeleteMovieReviewService } from "@/app/services/movies-reviews/delete-movie-review/delete-movie-review.service";
import { MovieReviewNotFoundException } from "@/app/services/movies-reviews/errors/movie-review-not-found.exception";

@Controller()
export class DeleteMovieReviewController {
  constructor (
    private readonly deleteMovieReviewService: DeleteMovieReviewService,
  ) {}

  @Delete('/movie-reviews/:id')
  public async handle(@Param() params: DeleteMovieReviewControllerRequestParamsDto): Promise<void> {
    try {
      await this.deleteMovieReviewService.execute({ id: params.id });
    } catch (error) {
      switch (error.constructor) {
        case MovieReviewNotFoundException: {
          throw new NotFoundException(error.message);
        }

        default: {
          throw new InternalServerErrorException();
        }
      }
    }
  }
}
