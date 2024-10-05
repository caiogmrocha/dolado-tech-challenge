import { Test, TestingModule } from "@nestjs/testing";

import { faker } from "@faker-js/faker";

import { CreateMovieReviewService } from "./create-movie-review.service";
import { MoviesReviewsRepository } from "@/app/interfaces/repositories/movies-reviews.repository";
import { MovieReview } from "@/domain/entities/movie-review.entity";
import { MovieReviewTitleAlreadyExistsException } from "../errors/movie-review-title-already-exists.exception";

describe('[Unit] CreateMovieReviewService', () => {
  let service: CreateMovieReviewService;
  let moviesReviewsRepository: jest.Mocked<MoviesReviewsRepository>;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        {
          provide: MoviesReviewsRepository,
          useClass: jest.fn().mockImplementation(() => ({
            getByTitle: jest.fn(),
            create: jest.fn(),
          })),
        },
        CreateMovieReviewService,
      ],
    }).compile();

    service = module.get<CreateMovieReviewService>(CreateMovieReviewService);
    moviesReviewsRepository = module.get<jest.Mocked<MoviesReviewsRepository>>(MoviesReviewsRepository);
  });

  it.todo('should create a new movie review');

  it('should throw MovieReviewTitleAlreadyExistsException when title already exists', async () => {
    // Arrange
    const params = {
      title: faker.commerce.productName(),
      notes: faker.lorem.paragraph(),
    };

    moviesReviewsRepository.getByTitle.mockResolvedValue({ title: params.title } as MovieReview);

    // Act
    const promise = service.execute(params);

    // Assert
    await expect(promise).rejects.toThrow(MovieReviewTitleAlreadyExistsException);
  });
});
