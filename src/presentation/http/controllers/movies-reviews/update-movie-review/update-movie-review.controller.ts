import { Body, Controller, HttpCode, HttpStatus, InternalServerErrorException, NotFoundException, Param, Put } from "@nestjs/common";

import { UpdateMovieReviewControllerRequestBodyDto, UpdateMovieReviewControllerRequestParamsDto } from "./update-movie-review.dto";
import { MovieReviewNotFoundException } from "@/app/services/movies-reviews/errors/movie-review-not-found.exception";
import { UpdateMovieReviewService } from "@/app/services/movies-reviews/update-movie-review/update-movie-review.service";

@Controller()
export class UpdateMovieReviewController {
  constructor (
    private readonly updateMovieReviewService: UpdateMovieReviewService
  ) {}

  @Put('/movie-reviews/:id')
  @HttpCode(HttpStatus.NO_CONTENT)
  public async handle(
    @Param() params: UpdateMovieReviewControllerRequestParamsDto,
    @Body() body: UpdateMovieReviewControllerRequestBodyDto
  ): Promise<void> {
    try {
      await this.updateMovieReviewService.execute({
        id: params.id,
        notes: body.notes,
      });
    } catch (error) {
      switch (error.constructor) {
        case MovieReviewNotFoundException: {
          throw new NotFoundException(error.message);
        }

        default: {
          throw new InternalServerErrorException(error.message);
        }
      }
    }
  }
}
