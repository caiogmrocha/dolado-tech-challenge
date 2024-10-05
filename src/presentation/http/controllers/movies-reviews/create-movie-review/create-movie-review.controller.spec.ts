import { MovieInfoProvider } from "@/app/interfaces/api/movie-info.provider";
import { MoviesReviewsRepository } from "@/app/interfaces/repositories/movies-reviews.repository";
import { CreateMovieReviewService } from "@/app/services/movies-reviews/create-movie-review/create-movie-review.service";
import { Test, TestingModule } from "@nestjs/testing";
import { CreateMovieReviewController } from "./create-movie-review.controller";
import { faker } from "@faker-js/faker/.";

describe('[Unit] CreateMovieReviewController', () => {
  let controller: CreateMovieReviewController;
  let service: CreateMovieReviewService;
  let moviesReviewsRepository: jest.Mocked<MoviesReviewsRepository>;
  let movieInfoProvider: jest.Mocked<MovieInfoProvider>;

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
    moviesReviewsRepository = module.get<jest.Mocked<MoviesReviewsRepository>>(MoviesReviewsRepository);
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

  it.todo('should throws ConflictException when movie review title already exists');
});
