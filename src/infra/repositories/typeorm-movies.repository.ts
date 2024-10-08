import { Injectable } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";

import { Repository } from "typeorm";

import { MoviesRepository } from "@/app/interfaces/repositories/movies.repository";
import { Movie } from "@/domain/entities/movie.entity";

@Injectable()
export class TypeormMoviesRepository implements MoviesRepository {
  constructor (
    @InjectRepository(Movie) private readonly movieRepository: Repository<Movie>,
  ) {}

  public async getPaginated(): Promise<Movie[]> {
    return this.movieRepository.find();
  }

  public async getByTitle(title: string): Promise<Movie> {
    return this.movieRepository.findOne({ where: { title }, relations: ['reviews'] });
  }

  public async create(movie: Movie): Promise<{ id: number }> {
    const { id } = await this.movieRepository.save(movie);

    return { id };
  }
}
