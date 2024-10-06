import { Test, TestingModule } from "@nestjs/testing";

import { UpdateMovieReviewService } from "./update-movie-review.service";
import { MovieReviewsRepository } from "@/app/interfaces/repositories/movie-reviews.repository";
import { MovieReviewNotFoundException } from "../errors/movie-review-not-found.exception";

describe('[Unit] UpdateMovieReviewService', () => {
  let service: UpdateMovieReviewService;
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
        UpdateMovieReviewService,
      ],
    }).compile();

    service = module.get<UpdateMovieReviewService>(UpdateMovieReviewService);
    moviesReviewsRepository = module.get<jest.Mocked<MovieReviewsRepository>>(MovieReviewsRepository);
  });

  it.todo('should update movie review');

  it('should throw MovieReviewNotFoundException when movie review not found', async () => {
    // Arrange
    const id = 1;
    moviesReviewsRepository.getById.mockResolvedValue(null);

    // Act
    const promise = service.execute({ id, notes: 'new notes' });

    // Assert
    await expect(promise).rejects.toThrow(MovieReviewNotFoundException);
  });
});
