import { Test, TestingModule } from "@nestjs/testing";

import { UpdateMovieReviewService } from "./update-movie-review.service";
import { MovieReviewsRepository } from "@/app/interfaces/repositories/movie-reviews.repository";
import { MovieReviewNotFoundException } from "../errors/movie-review-not-found.exception";
import { MovieReview } from "@/domain/entities/movie-review.entity";

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
            update: jest.fn(),
          })),
        },
        UpdateMovieReviewService,
      ],
    }).compile();

    service = module.get<UpdateMovieReviewService>(UpdateMovieReviewService);
    moviesReviewsRepository = module.get<jest.Mocked<MovieReviewsRepository>>(MovieReviewsRepository);
  });

  it('should update movie review', async () => {
    // Arrange
    const id = 1;
    const movieReview = new MovieReview({
      id,
      notes: 'notes',
    });
    moviesReviewsRepository.getById.mockResolvedValue(movieReview);

    // Act
    await service.execute({ id, notes: 'new notes' });

    // Assert
    expect(moviesReviewsRepository.getById).toHaveBeenCalledWith(id);
    expect(moviesReviewsRepository.update).toHaveBeenCalledWith({ ...movieReview, notes: 'new notes' });
  });

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
