import { Controller, Get, Inject, InternalServerErrorException, Query } from "@nestjs/common";

import { GetPaginatedMovieReviewsService } from "@/app/services/movies-reviews/get-paginated-movies-reviews/get-paginated-movie-reviews.service";
import { GetPaginatedMovieReviewsControllerDto } from "./get-paginated-movie-reviews.dto";

@Controller()
export class GetPaginatedMovieReviewsController {
  constructor (
    @Inject() private readonly getPaginatedMovieReviewsService: GetPaginatedMovieReviewsService
  ) {}

  @Get('/movie-reviews')
  public async handle(@Query() query: GetPaginatedMovieReviewsControllerDto) {
    try {
      return await this.getPaginatedMovieReviewsService.execute(query);
    } catch (error) {
      throw new InternalServerErrorException(error.message);
    }
  }
}
