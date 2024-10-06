import { Body, Controller, InternalServerErrorException, NotFoundException, Param, Put } from "@nestjs/common";

import { UpdateMovieReviewControllerRequestBodyDto, UpdateMovieReviewControllerRequestParamsDto } from "./update-movie-review.dto";
import { MovieReviewNotFoundException } from "@/app/services/movies-reviews/errors/movie-review-not-found.exception";
import { UpdateMovieReviewService } from "@/app/services/movies-reviews/update-movie-review/update-movie-review.service";

@Controller()
export class UpdateMovieReviewController {
  constructor (
    private readonly updateMovieReviewService: UpdateMovieReviewService
  ) {}

  @Put('/movie-reviews/:id')
  public async handle(
    @Param() params: UpdateMovieReviewControllerRequestParamsDto,
    @Body() body: UpdateMovieReviewControllerRequestBodyDto
  ): Promise<void> {
    return;
  }
}
