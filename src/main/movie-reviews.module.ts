import { HttpModule } from "@nestjs/axios";
import { Module } from "@nestjs/common";
import { TypeOrmModule } from "@nestjs/typeorm";

import { CreateMovieReviewController } from "@/presentation/http/controllers/movies-reviews/create-movie-review/create-movie-review.controller";
import { CreateMovieReviewService } from "@/app/services/movies-reviews/create-movie-review/create-movie-review.service";
import { OmdbMovieInfoProvider } from "@/infra/api/omdb-movie-info.provider";
import { MovieReview } from "@/domain/entities/movie-review.entity";
import { MovieReviewsRepository } from "@/app/interfaces/repositories/movie-reviews.repository";
import { TypeormMovieReviewsRepository } from "@/infra/repositories/typeorm-movie-reviews.repository";
import { MovieInfoProvider } from "@/app/interfaces/api/movie-info.provider";

@Module({
  imports: [
    HttpModule,
    TypeOrmModule.forFeature([MovieReview])
  ],
  exports: [
    TypeOrmModule,
  ],
  controllers: [
    CreateMovieReviewController,
  ],
  providers: [
    {
      provide: MovieInfoProvider,
      useClass: OmdbMovieInfoProvider,
    },
    {
      provide: MovieReviewsRepository,
      useClass: TypeormMovieReviewsRepository,
    },
    CreateMovieReviewService,
  ],
})
export class MovieReviewsModule {}
