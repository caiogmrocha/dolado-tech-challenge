import { Test, TestingModule } from "@nestjs/testing";

import { faker } from "@faker-js/faker";

import { MovieReviewsRepository } from "@/app/interfaces/repositories/movie-reviews.repository";
import { GetPaginatedMovieReviewsService } from "./get-paginated-movie-reviews.service";
import { MovieReview } from "@/domain/entities/movie-review.entity";
import { Movie } from "@/domain/entities/movie.entity";
import { Author } from "@/domain/entities/author.entity";

describe('[Unit] GetPaginatedMovieReviewsService', () => {
  let service: GetPaginatedMovieReviewsService;
  let moviesReviewsRepository: jest.Mocked<MovieReviewsRepository>;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        {
          provide: MovieReviewsRepository,
          useClass: jest.fn().mockImplementation(() => ({
            getPaginated: jest.fn(),
            getByTitle: jest.fn(),
            create: jest.fn(),
          })),
        },
        GetPaginatedMovieReviewsService,
      ],
    }).compile();

    service = module.get<GetPaginatedMovieReviewsService>(GetPaginatedMovieReviewsService);
    moviesReviewsRepository = module.get<jest.Mocked<MovieReviewsRepository>>(MovieReviewsRepository);
  });

  it('should return all movie reviews', async () => {
    // Arrange
    const movieReviews = [
      new MovieReview({
        id: faker.number.int(),
        notes: faker.lorem.paragraph(),
        movie: new Movie({
          id: faker.number.int(),
          title: faker.commerce.productName(),
          rating: faker.number.float({ min: 0, max: 10 }),
          releasedAt: faker.date.recent(),
          authors: [
            new Author({ name: faker.person.fullName() }),
          ]
        }),
      }),
    ];

    moviesReviewsRepository.getPaginated.mockResolvedValue(movieReviews);

    // Act
    const promise = service.execute();

    // Assert
    await expect(promise).resolves.toEqual(movieReviews.map(movieReview => ({
      title: movieReview.movie.title,
      rating: movieReview.movie.rating,
      releasedAt: movieReview.movie.releasedAt,
      notes: movieReview.notes,
    })));
    expect(moviesReviewsRepository.getPaginated).toHaveBeenCalledTimes(1);
  });
});
