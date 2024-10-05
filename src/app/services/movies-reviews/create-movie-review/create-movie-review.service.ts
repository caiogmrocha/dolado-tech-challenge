import { Inject, Injectable } from "@nestjs/common";

import { MovieReviewTitleAlreadyExistsException } from "../errors/movie-review-title-already-exists.exception";
import { MovieReviewsRepository } from "@/app/interfaces/repositories/movie-reviews.repository";
import { MovieInfoProvider } from "@/app/interfaces/api/movie-info.provider";
import { MovieReview } from "@/domain/entities/movie-review.entity";
import { MoviesRepository } from "@/app/interfaces/repositories/movies.repository";
import { Movie } from "@/domain/entities/movie.entity";
import { Author } from "@/domain/entities/author.entity";
import { AuthorsRepository } from "@/app/interfaces/repositories/authors.repository";

type CreateMovieReviewServiceParams = {
  title: string;
  notes: string;
}

type CreateMovieReviewServiceResponse = {
  reviewId: number;
};

@Injectable()
export class CreateMovieReviewService {
  constructor (
    @Inject(MoviesRepository) private readonly moviesRepository: MoviesRepository,
    @Inject(AuthorsRepository) private readonly authorsRepository: AuthorsRepository,
    @Inject(MovieReviewsRepository) private readonly movieReviewsRepository: MovieReviewsRepository,
    @Inject(MovieInfoProvider) private readonly movieInfoProvider: MovieInfoProvider,
  ) {}

  public async execute(params: CreateMovieReviewServiceParams): Promise<CreateMovieReviewServiceResponse> {
    let movie = await this.moviesRepository.getByTitle(params.title);

    if (!movie) {
      const movieInfo = await this.movieInfoProvider.getMovieInfo(params.title);

      const authors = movieInfo.authors.map(author => new Author({ name: author }));

      const authorsIds = await Promise.all(authors.map(author => this.authorsRepository.create(author)))

      authors.forEach((author, index) => author.id = authorsIds[index]);

      movie = new Movie({
        title: params.title,
        rating: movieInfo.rating,
        releasedAt: movieInfo.releasedAt,
        authors,
      })

      const { id: movieId } = await this.moviesRepository.create(movie);

      movie.id = movieId;
    } else if (movie.reviews?.length > 0) {
      throw new MovieReviewTitleAlreadyExistsException(movie.reviews[0].id);
    }

    const movieReview = new MovieReview({
      notes: params.notes,
      movie,
    });

    const { id } = await this.movieReviewsRepository.create(movieReview);

    return { reviewId: id };
  }
}
