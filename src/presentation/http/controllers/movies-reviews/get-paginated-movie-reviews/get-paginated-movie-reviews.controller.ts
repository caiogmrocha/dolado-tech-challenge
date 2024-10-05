import { Body, Controller, Inject, InternalServerErrorException } from "@nestjs/common";

import { GetPaginatedMovieReviewsService } from "@/app/services/movies-reviews/get-paginated-movies-reviews/get-paginated-movie-reviews.service";
import { GetPaginatedMovieReviewsControllerDto } from "./get-paginated-movie-reviews.dto";

@Controller()
export class GetPaginatedMovieReviewsController {
  constructor (
    @Inject() private readonly getPaginatedMovieReviewsService: GetPaginatedMovieReviewsService
  ) {}

  public async handle(@Body() body: GetPaginatedMovieReviewsControllerDto) {
    try {
      return await this.getPaginatedMovieReviewsService.execute(body);
    } catch (error) {
      throw new InternalServerErrorException(error.message);
    }
  }
}
