import { GetMovieReviewByIdService } from "@/app/services/movies-reviews/get-movie-review-by-id/get-movie-review-by-id.service";
import { Controller, Get, InternalServerErrorException, NotFoundException, Param } from "@nestjs/common";
import { GetMovieReviewByIdControllerRequestDto } from "./get-movie-review-by-id.dto";
import { MovieReviewNotFoundException } from "@/app/services/movies-reviews/errors/movie-review-not-found.exception";
import { ApiOperation } from "@nestjs/swagger";

export type GetMovieReviewByIdControllerResponse = {
  title: string;
  rating: number;
  releasedAt: Date;
  notes: string;
  authors: string[];
}

@Controller()
export class GetMovieReviewByIdController {
  constructor (
    private readonly getMovieReviewByIdService: GetMovieReviewByIdService
  ) {}

  @Get('/movie-reviews/:id')
  @ApiOperation({
    summary: 'Get a movie review by id',
    description: 'Get a movie review by the given id',
  })
  public async handle(@Param() params: GetMovieReviewByIdControllerRequestDto): Promise<GetMovieReviewByIdControllerResponse> {
    try {
      return await this.getMovieReviewByIdService.execute(params);
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
