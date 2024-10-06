import { HttpModule } from "@nestjs/axios";
import { Module } from "@nestjs/common";
import { TypeOrmModule } from "@nestjs/typeorm";

import { CreateMovieReviewController } from "@/presentation/http/controllers/movies-reviews/create-movie-review/create-movie-review.controller";
import { CreateMovieReviewService } from "@/app/services/movies-reviews/create-movie-review/create-movie-review.service";
import { GetPaginatedMovieReviewsController } from "@/presentation/http/controllers/movies-reviews/get-paginated-movie-reviews/get-paginated-movie-reviews.controller";
import { GetPaginatedMovieReviewsService } from "@/app/services/movies-reviews/get-paginated-movies-reviews/get-paginated-movie-reviews.service";
import { GetMovieReviewByIdController } from "@/presentation/http/controllers/movies-reviews/get-movie-review-by-id/get-movie-review-by-id.controller";
import { GetMovieReviewByIdService } from "@/app/services/movies-reviews/get-movie-review-by-id/get-movie-review-by-id.service";
import { OmdbMovieInfoProvider } from "@/infra/api/omdb-movie-info.provider";
import { MovieReviewsRepository } from "@/app/interfaces/repositories/movie-reviews.repository";
import { MoviesRepository } from "@/app/interfaces/repositories/movies.repository";
import { AuthorsRepository } from "@/app/interfaces/repositories/authors.repository";
import { TypeormMovieReviewsRepository } from "@/infra/repositories/typeorm-movie-reviews.repository";
import { TypeormMoviesRepository } from "@/infra/repositories/typeorm-movies.repository";
import { TypeormAuthorsRepository } from "@/infra/repositories/typeorm-authors.repository";
import { MovieInfoProvider } from "@/app/interfaces/api/movie-info.provider";
import { MovieReview } from "@/domain/entities/movie-review.entity";
import { Movie } from "@/domain/entities/movie.entity";
import { Author } from "@/domain/entities/author.entity";

@Module({
  imports: [
    HttpModule,
    TypeOrmModule.forFeature([
      Movie,
      Author,
      MovieReview
    ])
  ],
  exports: [
    TypeOrmModule,
  ],
  controllers: [
    CreateMovieReviewController,
    GetPaginatedMovieReviewsController,
    GetMovieReviewByIdController,
  ],
  providers: [
    {
      provide: MovieInfoProvider,
      useClass: OmdbMovieInfoProvider,
    },
    {
      provide: AuthorsRepository,
      useClass: TypeormAuthorsRepository,
    },
    {
      provide: MoviesRepository,
      useClass: TypeormMoviesRepository,
    },
    {
      provide: MovieReviewsRepository,
      useClass: TypeormMovieReviewsRepository,
    },
    CreateMovieReviewService,
    GetPaginatedMovieReviewsService,
    GetMovieReviewByIdService,
  ],
})
export class MovieReviewsModule {}
