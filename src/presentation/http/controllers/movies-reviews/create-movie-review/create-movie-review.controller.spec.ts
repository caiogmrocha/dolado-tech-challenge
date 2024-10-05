import { Test, TestingModule } from "@nestjs/testing";
import { ConflictException } from "@nestjs/common";

import { faker } from "@faker-js/faker";

import { CreateMovieReviewController } from "./create-movie-review.controller";
import { CreateMovieReviewService } from "@/app/services/movies-reviews/create-movie-review/create-movie-review.service";
import { MovieReviewsRepository } from "@/app/interfaces/repositories/movie-reviews.repository";
import { MovieInfoProvider } from "@/app/interfaces/api/movie-info.provider";
import { MovieReview } from "@/domain/entities/movie-review.entity";

describe('[Unit] CreateMovieReviewController', () => {
  let controller: CreateMovieReviewController;
  let service: CreateMovieReviewService;
  let moviesReviewsRepository: jest.Mocked<MovieReviewsRepository>;
  let movieInfoProvider: jest.Mocked<MovieInfoProvider>;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        {
          provide: MovieReviewsRepository,
          useClass: jest.fn().mockImplementation(() => ({
            getByTitle: jest.fn(),
            create: jest.fn(),
          })),
        },
        {
          provide: MovieInfoProvider,
          useClass: jest.fn().mockImplementation(() => ({
            getMovieInfo: jest.fn(),
          })),
        },
        CreateMovieReviewService,
      ],
      controllers: [
        CreateMovieReviewController,
      ],
    }).compile();

    service = module.get<CreateMovieReviewService>(CreateMovieReviewService);
    moviesReviewsRepository = module.get<jest.Mocked<MovieReviewsRepository>>(MovieReviewsRepository);
    movieInfoProvider = module.get<jest.Mocked<MovieInfoProvider>>(MovieInfoProvider);
    controller = module.get<CreateMovieReviewController>(CreateMovieReviewController);
  });

  it('should create a new movie review', async () => {
    // Arrange
    const params = {
      title: 'The Matrix',
      notes: 'This is a great movie!',
    };

    const reviewId = 1;

    moviesReviewsRepository.getByTitle.mockResolvedValue(null);
    moviesReviewsRepository.create.mockResolvedValue({ id: reviewId });
    movieInfoProvider.getMovieInfo.mockResolvedValue({
      title: faker.commerce.productName(),
      rating: faker.number.float({ min: 0, max: 10 }),
      releasedAt: faker.date.recent(),
    });

    // Act
    const response = await controller.handle(params);

    // Assert
    expect(response).toEqual({ reviewId: reviewId });
  });

  it('should throws ConflictException when movie review title already exists', async () => {
    // Arrange
    const params = {
      title: faker.commerce.productName(),
      notes: faker.lorem.paragraph(),
    };

    moviesReviewsRepository.getByTitle.mockResolvedValue({ title: params.title } as MovieReview);

    // Act
    const promise = controller.handle(params);

    // Assert
    await expect(promise).rejects.toThrow(ConflictException);
  });
});
