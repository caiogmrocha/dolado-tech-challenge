import { Test, TestingModule } from "@nestjs/testing";

import { faker } from "@faker-js/faker";

import { GetMovieReviewByIdController } from "./get-movie-review-by-id.controller";
import { GetMovieReviewByIdService } from "@/app/services/movies-reviews/get-movie-review-by-id/get-movie-review-by-id.service";
import { MovieReviewsRepository } from "@/app/interfaces/repositories/movie-reviews.repository";
import { MovieReview } from "@/domain/entities/movie-review.entity";
import { Movie } from "@/domain/entities/movie.entity";
import { Author } from "@/domain/entities/author.entity";
import { NotFoundException } from "@nestjs/common";

describe('[Unit] GetMovieReviewByIdController', () => {
  let controller: GetMovieReviewByIdController;
  let service: GetMovieReviewByIdService;
  let moviesReviewsRepository: jest.Mocked<MovieReviewsRepository>;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        {
          provide: MovieReviewsRepository,
          useClass: jest.fn().mockImplementation(() => ({
            getById: jest.fn(),
          })),
        },
        GetMovieReviewByIdService,
      ],
      controllers: [GetMovieReviewByIdController],
    }).compile();

    controller = module.get<GetMovieReviewByIdController>(GetMovieReviewByIdController);
    service = module.get<GetMovieReviewByIdService>(GetMovieReviewByIdService);
    moviesReviewsRepository = module.get<jest.Mocked<MovieReviewsRepository>>(MovieReviewsRepository);
  });

  it('should return movie review by id', async () => {
    // Arrange
    const id = faker.number.int();
    const movieReview = new MovieReview({
      movie: new Movie({
        title: faker.lorem.words(),
        rating: faker.number.float(),
        releasedAt: faker.date.recent(),
        authors: Array.from({ length: faker.number.int({ min: 1, max: 5 }) }, () => new Author({
          name: faker.person.fullName(),
        })),
      }),
      notes: faker.lorem.paragraph(),
    });
    moviesReviewsRepository.getById.mockResolvedValue(movieReview);

    // Act
    const response = await controller.handle({ id });

    // Assert
    expect(response).toEqual({
      title: movieReview.movie.title,
      rating: movieReview.movie.rating,
      releasedAt: movieReview.movie.releasedAt,
      notes: movieReview.notes,
      authors: movieReview.movie.authors.map(author => author.name),
    });
  });

  it('should throw NotFoundException when movie review not found', async () => {
    // Arrange
    const id = faker.number.int();
    moviesReviewsRepository.getById.mockResolvedValue(null);

    // Act
    const promise = controller.handle({ id });

    // Assert
    await expect(promise).rejects.toThrow(NotFoundException);
  });
});
