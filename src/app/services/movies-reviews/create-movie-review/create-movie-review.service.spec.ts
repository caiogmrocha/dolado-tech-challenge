import { Test, TestingModule } from "@nestjs/testing";

import { faker } from "@faker-js/faker";

import { CreateMovieReviewService } from "./create-movie-review.service";
import { MovieReviewsRepository } from "@/app/interfaces/repositories/movie-reviews.repository";
import { MovieInfoProvider } from "@/app/interfaces/api/movie-info.provider";
import { MovieReview } from "@/domain/entities/movie-review.entity";
import { MovieReviewTitleAlreadyExistsException } from "../errors/movie-review-title-already-exists.exception";

describe('[Unit] CreateMovieReviewService', () => {
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
    }).compile();

    service = module.get<CreateMovieReviewService>(CreateMovieReviewService);
    moviesReviewsRepository = module.get<jest.Mocked<MovieReviewsRepository>>(MovieReviewsRepository);
    movieInfoProvider = module.get<jest.Mocked<MovieInfoProvider>>(MovieInfoProvider);
  });

  it('should create a new movie review', async () => {
    // Arrange
    const params = {
      title: faker.commerce.productName(),
      notes: faker.lorem.paragraph(),
    };

    const reviewId = faker.number.int();

    moviesReviewsRepository.getByTitle.mockResolvedValue(null);
    moviesReviewsRepository.create.mockResolvedValue({ id: reviewId });
    movieInfoProvider.getMovieInfo.mockResolvedValue({
      title: params.title,
      rating: faker.number.float({ min: 0, max: 10 }),
      releasedAt: faker.date.recent(),
    });

    // Act
    const promise = service.execute(params);

    // Assert
    await expect(promise).resolves.toEqual({ reviewId });
    expect(moviesReviewsRepository.create).toHaveBeenCalled();
    expect(movieInfoProvider.getMovieInfo).toHaveBeenCalledWith(params.title);
  });

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
