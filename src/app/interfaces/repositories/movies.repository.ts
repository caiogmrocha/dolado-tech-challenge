import { Movie } from "@/domain/entities/movie.entity";

export interface MoviesRepository {
  getByTitle(title: string): Promise<Movie | null>;
  create(movie: Movie): Promise<{ id: number }>;
}

export const MoviesRepository = Symbol('MoviesRepository');
