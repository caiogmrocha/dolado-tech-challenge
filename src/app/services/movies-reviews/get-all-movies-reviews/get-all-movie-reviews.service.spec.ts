import { Test, TestingModule } from "@nestjs/testing";

import { MovieReviewsRepository } from "@/app/interfaces/repositories/movie-reviews.repository";
import { GetAllMovieReviewsService } from "./get-all-movie-reviews.service";
import { faker } from "@faker-js/faker/.";
import { MovieReview } from "@/domain/entities/movie-review.entity";

describe('[Unit] GetAllMovieReviewsService', () => {
  let service: GetAllMovieReviewsService;
  let moviesReviewsRepository: jest.Mocked<MovieReviewsRepository>;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        {
          provide: MovieReviewsRepository,
          useClass: jest.fn().mockImplementation(() => ({
            getAll: jest.fn(),
            getByTitle: jest.fn(),
            create: jest.fn(),
          })),
        },
        GetAllMovieReviewsService,
      ],
    }).compile();

    service = module.get<GetAllMovieReviewsService>(GetAllMovieReviewsService);
    moviesReviewsRepository = module.get<jest.Mocked<MovieReviewsRepository>>(MovieReviewsRepository);
  });

  it('should return all movie reviews', async () => {
    // Arrange
    const movieReviews = [
      new MovieReview({
        title: faker.commerce.productName(),
        rating: faker.number.float({ min: 0, max: 10 }),
        releasedAt: faker.date.recent(),
        notes: faker.lorem.paragraph(),
      }),
    ];

    moviesReviewsRepository.getAll.mockResolvedValue(movieReviews);

    // Act
    const promise = service.execute();

    // Assert
    await expect(promise).resolves.toEqual(movieReviews.map(movieReview => ({
      title: movieReview.title,
      rating: movieReview.rating,
      releasedAt: movieReview.releasedAt,
      notes: movieReview.notes,
    })));
  });
});
