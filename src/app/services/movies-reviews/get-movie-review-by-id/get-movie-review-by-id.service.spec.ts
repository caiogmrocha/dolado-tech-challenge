import { Test, TestingModule } from "@nestjs/testing";
import { faker } from "@faker-js/faker";

import { MovieReviewsRepository } from "@/app/interfaces/repositories/movie-reviews.repository";
import { GetMovieReviewByIdService } from "./get-movie-review-by-id.service";
import { MovieReviewNotFoundException } from "../errors/movie-review-not-found.exception";

describe('[Unit] GetPaginatedMovieReviewsService', () => {
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
    }).compile();

    service = module.get<GetMovieReviewByIdService>(GetMovieReviewByIdService);
    moviesReviewsRepository = module.get<jest.Mocked<MovieReviewsRepository>>(MovieReviewsRepository);
  });

  it.todo('should return movie review by id');

  it('should throw MovieReviewNotFoundException when movie review not found', async () => {
    // Arrange
    const id = faker.number.int();
    moviesReviewsRepository.getById.mockResolvedValue(null);

    // Act
    const promise = service.execute({ id });

    // Assert
    await expect(promise).rejects.toThrow(MovieReviewNotFoundException);
  });
});
