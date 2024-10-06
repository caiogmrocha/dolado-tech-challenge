import { Test, TestingModule } from "@nestjs/testing";

import { DeleteMovieReviewService } from "@/app/services/movies-reviews/delete-movie-review/delete-movie-review.service";
import { MovieReviewsRepository } from "@/app/interfaces/repositories/movie-reviews.repository";
import { DeleteMovieReviewController } from "./delete-movie-review.controller";
import { NotFoundException } from "@nestjs/common";

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

  it.todo('should delete a movie review');

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
