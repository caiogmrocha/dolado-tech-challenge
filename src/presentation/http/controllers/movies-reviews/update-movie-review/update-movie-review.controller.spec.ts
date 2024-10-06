import { MovieReviewsRepository } from "@/app/interfaces/repositories/movie-reviews.repository";
import { UpdateMovieReviewController } from "./update-movie-review.controller";
import { UpdateMovieReviewService } from "@/app/services/movies-reviews/update-movie-review/update-movie-review.service";
import { Test, TestingModule } from "@nestjs/testing";

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
        UpdateMovieReviewController,
      ],
      controllers: [UpdateMovieReviewController],
    }).compile();

    controller = module.get<UpdateMovieReviewController>(UpdateMovieReviewController);
    service = module.get<UpdateMovieReviewService>(UpdateMovieReviewService);
    moviesReviewsRepository = module.get<jest.Mocked<MovieReviewsRepository>>(MovieReviewsRepository);
  });

  it.todo('should update movie review');
  it.todo('should throw NotFoundException when movie review not found');
});
