import { Body, ConflictException, Controller, HttpCode, HttpStatus, InternalServerErrorException, Logger, Post } from "@nestjs/common";

import { CreateMovieReviewControllerRequestBodyDto } from "./create-movie.review.dto";
import { CreateMovieReviewService } from "@/app/services/movies-reviews/create-movie-review/create-movie-review.service";
import { MovieReviewTitleAlreadyExistsException } from "@/app/services/movies-reviews/errors/movie-review-title-already-exists.exception";
import { ApiBody, ApiOperation } from "@nestjs/swagger";

@Controller()
export class CreateMovieReviewController {
  constructor (
    private readonly createMovieReviewService: CreateMovieReviewService
  ) {}

  @Post('/movie-reviews')
  @HttpCode(HttpStatus.CREATED)
  @ApiOperation({
    summary: 'Create a new movie review',
    description: 'Create a new movie review with the given data',
  })
  public async handle(@Body() requestDto: CreateMovieReviewControllerRequestBodyDto): Promise<any> {
    try {
      const response = await this.createMovieReviewService.execute({
        title: requestDto.title,
        notes: requestDto.notes,
      });

      return response;
    } catch (error) {
      switch (error.constructor) {
        case MovieReviewTitleAlreadyExistsException: {
          throw new ConflictException(error.message);
        };

        default: {
          console.error(error);
          throw new InternalServerErrorException();
        };
      }
    }
  }
}
