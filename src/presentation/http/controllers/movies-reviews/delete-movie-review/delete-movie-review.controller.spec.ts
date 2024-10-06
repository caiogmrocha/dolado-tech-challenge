import { Test, TestingModule } from "@nestjs/testing";
import { NotFoundException } from "@nestjs/common";

import { faker } from "@faker-js/faker";

import { DeleteMovieReviewController } from "./delete-movie-review.controller";
import { DeleteMovieReviewService } from "@/app/services/movies-reviews/delete-movie-review/delete-movie-review.service";
import { MovieReviewsRepository } from "@/app/interfaces/repositories/movie-reviews.repository";
import { MovieReview } from "@/domain/entities/movie-review.entity";

describe('[Unit] DeleteMovieReviewController', () => {
  let controller: DeleteMovieReviewController;
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
      controllers: [DeleteMovieReviewController],
    }).compile();

    controller = module.get<DeleteMovieReviewController>(DeleteMovieReviewController);
    service = module.get<DeleteMovieReviewService>(DeleteMovieReviewService);
    moviesReviewsRepository = module.get<jest.Mocked<MovieReviewsRepository>>(MovieReviewsRepository);
  });

  it('should delete a movie review', async () => {
    // Arrange
    const movieReview = new MovieReview({
      id: 1,
      notes: faker.lorem.sentence(),
    });
    moviesReviewsRepository.getById.mockResolvedValue(movieReview);

    // Act
    await controller.handle({ id: movieReview.id });

    // Assert
    expect(moviesReviewsRepository.delete).toHaveBeenCalledWith(movieReview);
  });

  it('should throw NotFoundException when movie review does not exist', async () => {
    // Arrange
    const params = { id: 1 };
    moviesReviewsRepository.getById.mockResolvedValue(null);

    // Act
    const promise = controller.handle(params);

    // Assert
    await expect(promise).rejects.toThrow(NotFoundException);
  });
});
