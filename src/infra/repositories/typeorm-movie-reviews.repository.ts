import { Injectable } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";

import { FindManyOptions, Like, Repository } from "typeorm";

import { MovieReviewsRepository, MovieReviewsRepositoryGetPaginatedParams } from "@/app/interfaces/repositories/movie-reviews.repository";
import { MovieReview } from "@/domain/entities/movie-review.entity";

@Injectable()
export class TypeormMovieReviewsRepository implements MovieReviewsRepository {
  constructor (
    @InjectRepository(MovieReview) private readonly movieReviewRepository: Repository<MovieReview>,
  ) {}

  public async getPaginated(params: MovieReviewsRepositoryGetPaginatedParams): Promise<MovieReview[]> {
    const options: FindManyOptions<MovieReview> = {
      relations: ['movie'],
    };

    if (params.orderBy) {
      options.order = { movie: { [params.orderBy]: params.order } };
    }

    if (params.filterByTitle) {
      options.where = { movie: { title: Like(`%${params.filterByTitle}%`) } };
    }

    if (params.filterByAuthor) {
      options.where = { movie: { authors: { name: Like(`%${params.filterByAuthor}%`) } } };
    }

    options.take = params.limit;
    options.skip = params.offset;

    return this.movieReviewRepository.find(options);
  }

  public async getById(id: number): Promise<MovieReview> {
    return this.movieReviewRepository.findOne({ where: { id }, relations: [
      'movie',
      'movie.authors',
    ] });
  }

  public async getByTitle(title: string): Promise<MovieReview> {
    return this.movieReviewRepository.findOneBy({ movie: { title } });
  }

  public async create(movieReview: MovieReview): Promise<{ id: number }> {
    const { id } = await this.movieReviewRepository.save(movieReview);

    return { id };
  }

  public async update(movieReview: MovieReview): Promise<void> {
    await this.movieReviewRepository.update(movieReview.id, movieReview);
  }

  public async delete(movieReview: MovieReview): Promise<void> {
    await this.movieReviewRepository.softDelete(movieReview.id);
  }
}
