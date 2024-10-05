import { HttpModule } from "@nestjs/axios";
import { Module } from "@nestjs/common";
import { TypeOrmModule } from "@nestjs/typeorm";

import { CreateMovieReviewController } from "@/presentation/http/controllers/movies-reviews/create-movie-review/create-movie-review.controller";
import { CreateMovieReviewService } from "@/app/services/movies-reviews/create-movie-review/create-movie-review.service";
import { OmdbMovieInfoProvider } from "@/infra/api/omdb-movie-info.provider";
import { MovieReview } from "@/domain/entities/movie-review.entity";
import { Movie } from "@/domain/entities/movie.entity";
import { MovieReviewsRepository } from "@/app/interfaces/repositories/movie-reviews.repository";
import { TypeormMovieReviewsRepository } from "@/infra/repositories/typeorm-movie-reviews.repository";
import { MovieInfoProvider } from "@/app/interfaces/api/movie-info.provider";
import { MoviesRepository } from "@/app/interfaces/repositories/movies.repository";
import { TypeormMoviesRepository } from "@/infra/repositories/typeorm-movies.repository";
import { AuthorsRepository } from "@/app/interfaces/repositories/authors.repository";
import { TypeormAuthorsRepository } from "@/infra/repositories/typeorm-authors.repository";
import { Author } from "@/domain/entities/author.entity";
import { GetPaginatedMovieReviewsController } from "@/presentation/http/controllers/movies-reviews/get-paginated-movie-reviews/get-paginated-movie-reviews.controller";
import { GetPaginatedMovieReviewsService } from "@/app/services/movies-reviews/get-paginated-movies-reviews/get-paginated-movie-reviews.service";

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
  ],
})
export class MovieReviewsModule {}
