import { Test, TestingModule } from "@nestjs/testing";

import { DeleteMovieReviewService } from "./delete-movie-review.service";
import { MovieReviewsRepository } from "@/app/interfaces/repositories/movie-reviews.repository";
import { MovieReviewNotFoundException } from "../errors/movie-review-not-found.exception";
import { MovieReview } from "@/domain/entities/movie-review.entity";

describe('[Unit] DeleteMovieReviewService', () => {
  let service: DeleteMovieReviewService;
  let moviesReviewsRepository: jest.Mocked<MovieReviewsRepository>;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        {
          provide: MovieReviewsRepository,
          useClass: jest.fn().mockImplementation(() => ({
            getById: jest.fn(),
            delete: jest.fn(),
          })),
        },
        DeleteMovieReviewService,
      ],
    }).compile();

    service = module.get<DeleteMovieReviewService>(DeleteMovieReviewService);
    moviesReviewsRepository = module.get<jest.Mocked<MovieReviewsRepository>>(MovieReviewsRepository);
  });

  it('should delete a movie review', async () => {
    // Arrange
    const movieReview = new MovieReview({
      id: 1,
      notes: 'Lorem ipsum',
    });

    moviesReviewsRepository.getById.mockResolvedValue(movieReview);

    // Act
    await service.execute({ id: movieReview.id });

    // Assert
    expect(moviesReviewsRepository.delete).toHaveBeenCalledWith(movieReview);
  });

  it('should throw MovieReviewNotFoundException when movie review does not exist', async () => {
    // Arrange
    const movieReviewId = 1;
    moviesReviewsRepository.getById.mockResolvedValue(null);

    // Act
    const promise = service.execute({ id: movieReviewId });

    // Assert
    await expect(promise).rejects.toThrow(MovieReviewNotFoundException);
  });
});
