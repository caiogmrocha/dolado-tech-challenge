import { Controller, Get, Inject, InternalServerErrorException, Query } from "@nestjs/common";

import { GetPaginatedMovieReviewsService } from "@/app/services/movies-reviews/get-paginated-movies-reviews/get-paginated-movie-reviews.service";
import { GetPaginatedMovieReviewsControllerRequestQueryDto } from "./get-paginated-movie-reviews.dto";
import { ApiOperation } from "@nestjs/swagger";

@Controller()
export class GetPaginatedMovieReviewsController {
  constructor (
    @Inject() private readonly getPaginatedMovieReviewsService: GetPaginatedMovieReviewsService
  ) {}

  @Get('/movie-reviews')
  @ApiOperation({
    summary: 'Get paginated movie reviews',
    description: 'Get paginated movie reviews with the given query parameters',
  })
  public async handle(@Query() query: GetPaginatedMovieReviewsControllerRequestQueryDto) {
    try {
      return await this.getPaginatedMovieReviewsService.execute(query);
    } catch (error) {
      throw new InternalServerErrorException(error.message);
    }
  }
}
