import { CreateMovieReviewService } from "@/app/services/movies-reviews/create-movie-review/create-movie-review.service";
import { Body, ConflictException, Controller, InternalServerErrorException } from "@nestjs/common";
import { CreateMovieReviewDto } from "./create-movie.review.dto";
import { MovieReviewTitleAlreadyExistsException } from "@/app/services/movies-reviews/errors/movie-review-title-already-exists.exception";

@Controller()
export class CreateMovieReviewController {
  constructor (
    private readonly createMovieReviewService: CreateMovieReviewService
  ) {}

  public async handle(@Body() requestDto: CreateMovieReviewDto): Promise<any> {
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
          throw new InternalServerErrorException();
        };
      }
    }
  }
}
