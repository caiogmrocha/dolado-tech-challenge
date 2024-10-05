import { Test, TestingModule } from "@nestjs/testing";
import { ConflictException } from "@nestjs/common";

import { faker } from "@faker-js/faker";

import { CreateMovieReviewController } from "./create-movie-review.controller";
import { CreateMovieReviewService } from "@/app/services/movies-reviews/create-movie-review/create-movie-review.service";
import { MovieReviewsRepository } from "@/app/interfaces/repositories/movie-reviews.repository";
import { MovieInfoProvider } from "@/app/interfaces/api/movie-info.provider";
import { MovieReview } from "@/domain/entities/movie-review.entity";
import { Movie } from "@/domain/entities/movie.entity";
import { Author } from "@/domain/entities/author.entity";
import { MoviesRepository } from "@/app/interfaces/repositories/movies.repository";
import { AuthorsRepository } from "@/app/interfaces/repositories/authors.repository";

describe('[Unit] CreateMovieReviewController', () => {
  let controller: CreateMovieReviewController;
  let service: CreateMovieReviewService;
  let moviesRepository: jest.Mocked<MoviesRepository>;
  let authorsRepository: jest.Mocked<AuthorsRepository>;
  let moviesReviewsRepository: jest.Mocked<MovieReviewsRepository>;
  let movieInfoProvider: jest.Mocked<MovieInfoProvider>;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        {
          provide: MoviesRepository,
          useClass: jest.fn().mockImplementation(() => ({
            getByTitle: jest.fn(),
            create: jest.fn(),
          })),
        },
        {
          provide: AuthorsRepository,
          useClass: jest.fn().mockImplementation(() => ({
            createMany: jest.fn(),
          })),
        },
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
    moviesRepository = module.get<jest.Mocked<MoviesRepository>>(MoviesRepository);
    authorsRepository = module.get<jest.Mocked<AuthorsRepository>>(AuthorsRepository);
    moviesReviewsRepository = module.get<jest.Mocked<MovieReviewsRepository>>(MovieReviewsRepository);
    movieInfoProvider = module.get<jest.Mocked<MovieInfoProvider>>(MovieInfoProvider);
    controller = module.get<CreateMovieReviewController>(CreateMovieReviewController);
  });

  it('should create a new movie review', async () => {
    // Arrange
    const params = {
      title: faker.commerce.productName(),
      notes: faker.lorem.paragraph(),
    };

    const reviewId = 1;

    movieInfoProvider.getMovieInfo.mockResolvedValue({
      title: faker.commerce.productName(),
      rating: faker.number.float({ min: 0, max: 10 }),
      releasedAt: faker.date.recent(),
      authors: [faker.person.fullName()],
    });

    moviesRepository.getByTitle.mockResolvedValue(null);

    moviesRepository.create.mockResolvedValue({ id: faker.number.int() });

    moviesReviewsRepository.getByTitle.mockResolvedValue(null);

    moviesReviewsRepository.create.mockResolvedValue({ id: reviewId });

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

    moviesRepository.getByTitle.mockResolvedValue(null);
    moviesRepository.create.mockResolvedValue({ id: faker.number.int() });

    const movie = new Movie({
      id: faker.number.int(),
      title: params.title,
      rating: faker.number.float({ min: 0, max: 10 }),
      releasedAt: faker.date.recent(),
      authors: [
        new Author({ name: faker.person.fullName() }),
      ],
      reviews: [
        new MovieReview({
          id: faker.number.int(),
          notes: faker.lorem.paragraph(),
        }),
      ],
    });

    movie.reviews[0].movie = movie;

    moviesRepository.getByTitle.mockResolvedValue(movie);

    moviesReviewsRepository.create.mockResolvedValue({ id: faker.number.int() });

    movieInfoProvider.getMovieInfo.mockResolvedValue({
      title: faker.commerce.productName(),
      rating: faker.number.float({ min: 0, max: 10 }),
      releasedAt: faker.date.recent(),
      authors: [faker.person.fullName()],
    });

    // Act
    const promise = controller.handle(params);

    // Assert
    await expect(promise).rejects.toThrow(ConflictException);
  });
});
