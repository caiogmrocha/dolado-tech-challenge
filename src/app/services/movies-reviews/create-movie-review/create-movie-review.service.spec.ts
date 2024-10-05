import { Test, TestingModule } from "@nestjs/testing";

import { faker } from "@faker-js/faker";

import { CreateMovieReviewService } from "./create-movie-review.service";
import { MovieReviewsRepository } from "@/app/interfaces/repositories/movie-reviews.repository";
import { MovieInfoProvider } from "@/app/interfaces/api/movie-info.provider";
import { MovieReview } from "@/domain/entities/movie-review.entity";
import { MovieReviewTitleAlreadyExistsException } from "../errors/movie-review-title-already-exists.exception";
import { MoviesRepository } from "@/app/interfaces/repositories/movies.repository";
import { AuthorsRepository } from "@/app/interfaces/repositories/authors.repository";
import { Movie } from "@/domain/entities/movie.entity";
import { Author } from "@/domain/entities/author.entity";

describe('[Unit] CreateMovieReviewService', () => {
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
            create: jest.fn(),
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
    }).compile();

    service = module.get<CreateMovieReviewService>(CreateMovieReviewService);
    moviesRepository = module.get<jest.Mocked<MoviesRepository>>(MoviesRepository);
    authorsRepository = module.get<jest.Mocked<AuthorsRepository>>(AuthorsRepository);
    moviesReviewsRepository = module.get<jest.Mocked<MovieReviewsRepository>>(MovieReviewsRepository);
    movieInfoProvider = module.get<jest.Mocked<MovieInfoProvider>>(MovieInfoProvider);
  });

  it('should create a new movie review', async () => {
    // Arrange
    const params = {
      title: faker.commerce.productName(),
      notes: faker.lorem.paragraph(),
    };

    moviesRepository.getByTitle.mockResolvedValue(null);

    movieInfoProvider.getMovieInfo.mockResolvedValue({
      title: faker.commerce.productName(),
      rating: faker.number.float({ min: 0, max: 10 }),
      releasedAt: faker.date.recent(),
      authors: [faker.person.fullName()],
    });

    moviesRepository.create.mockResolvedValue({ id: faker.number.int() });

    authorsRepository.create.mockResolvedValue(faker.number.int());

    moviesReviewsRepository.getByTitle.mockResolvedValue(null);

    const reviewId = 1;

    moviesReviewsRepository.create.mockResolvedValue({ id: reviewId });

    // Act
    const response = await service.execute(params);

    // Assert
    expect(response).toEqual({ reviewId });
  });

  it('should throw MovieReviewTitleAlreadyExistsException when title already exists', async () => {
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

    authorsRepository.create.mockResolvedValue(faker.number.int());

    moviesReviewsRepository.create.mockResolvedValue({ id: faker.number.int() });

    movieInfoProvider.getMovieInfo.mockResolvedValue({
      title: faker.commerce.productName(),
      rating: faker.number.float({ min: 0, max: 10 }),
      releasedAt: faker.date.recent(),
      authors: [faker.person.fullName()],
    });

    // Act
    const promise = service.execute(params);

    // Assert
    await expect(promise).rejects.toThrow(MovieReviewTitleAlreadyExistsException);
  });

  it.todo('should throw MovieInfoNotFoundException when movie info is not found');
});
