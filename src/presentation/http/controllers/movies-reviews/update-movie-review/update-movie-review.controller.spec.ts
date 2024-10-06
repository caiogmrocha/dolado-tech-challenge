import { Test, TestingModule } from "@nestjs/testing";
import { NotFoundException } from "@nestjs/common";

import { faker } from "@faker-js/faker";

import { UpdateMovieReviewController } from "./update-movie-review.controller";
import { UpdateMovieReviewService } from "@/app/services/movies-reviews/update-movie-review/update-movie-review.service";
import { MovieReviewsRepository } from "@/app/interfaces/repositories/movie-reviews.repository";
import { MovieReview } from "@/domain/entities/movie-review.entity";

describe('[Unit] UpdateMovieReviewController', () => {
  let controller: UpdateMovieReviewController;
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
      controllers: [UpdateMovieReviewController],
    }).compile();

    controller = module.get<UpdateMovieReviewController>(UpdateMovieReviewController);
    service = module.get<UpdateMovieReviewService>(UpdateMovieReviewService);
    moviesReviewsRepository = module.get<jest.Mocked<MovieReviewsRepository>>(MovieReviewsRepository);
  });

  it('should update movie review', async () => {
    // Arrange
    const params = { id: 1 };
    const body = { notes: faker.lorem.paragraph() };

    const movieReview = new MovieReview({
      id: params.id,
      notes: faker.lorem.paragraph(),
    });

    moviesReviewsRepository.getById.mockResolvedValue(movieReview);

    // Act
    await controller.handle({ id: params.id }, body);

    // Assert
    expect(moviesReviewsRepository.getById).toHaveBeenCalledWith(params.id);
    expect(moviesReviewsRepository.update).toHaveBeenCalledWith({ id: params.id, notes: body.notes });
  });

  it('should throw NotFoundException when movie review not found', async () => {
    // Arrange
    const params = { id: 1 };

    moviesReviewsRepository.getById.mockResolvedValue(null);

    // Act
    const promise = controller.handle({ id: params.id }, { notes: faker.lorem.paragraph() });

    // Assert
    await expect(promise).rejects.toThrow(NotFoundException);
  });
});
