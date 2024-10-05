import { Injectable } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";

import { Repository } from "typeorm";

import { MovieReviewsRepository } from "@/app/interfaces/repositories/movie-reviews.repository";
import { MovieReview } from "@/domain/entities/movie-review.entity";

@Injectable()
export class TypeormMovieReviewsRepository implements MovieReviewsRepository {
  constructor (
    @InjectRepository(MovieReview) private readonly movieReviewRepository: Repository<MovieReview>,
  ) {}

  public async getPaginated(): Promise<MovieReview[]> {
    return this.movieReviewRepository.find();
  }

  public async getByTitle(title: string): Promise<MovieReview> {
    return this.movieReviewRepository.findOneBy({ movie: { title } });
  }

  public async create(movieReview: MovieReview): Promise<{ id: number }> {
    const { id } = await this.movieReviewRepository.save(movieReview);

    return { id };
  }
}
