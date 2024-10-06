import { MovieReviewsRepository } from "@/app/interfaces/repositories/movie-reviews.repository";
import { Inject, Injectable } from "@nestjs/common";
import { MovieReviewNotFoundException } from "../errors/movie-review-not-found.exception";

export type GetMovieReviewByIdServiceParams = {
  id: number;
}

export type GetMovieReviewByIdServiceResponse = {
  title: string;
  rating: number;
  releasedAt: Date;
  notes: string;
  authors: string[];
}

@Injectable()
export class GetMovieReviewByIdService {
  constructor (
    @Inject(MovieReviewsRepository) private readonly movieReviewsRepository: MovieReviewsRepository
  ) {}

  public async execute(params: GetMovieReviewByIdServiceParams): Promise<GetMovieReviewByIdServiceResponse> {
    const movieReview = await this.movieReviewsRepository.getById(params.id);

    if (!movieReview) {
      throw new MovieReviewNotFoundException(params.id);
    }

    return {
      title: movieReview.movie.title,
      rating: movieReview.movie.rating,
      releasedAt: movieReview.movie.releasedAt,
      notes: movieReview.notes,
      authors: movieReview.movie.authors.map(author => author.name),
    };
  }
}
