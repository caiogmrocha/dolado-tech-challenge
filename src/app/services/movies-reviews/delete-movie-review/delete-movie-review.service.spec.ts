import { Test, TestingModule } from "@nestjs/testing";

import { DeleteMovieReviewService } from "./delete-movie-review.service";
import { MovieReviewsRepository } from "@/app/interfaces/repositories/movie-reviews.repository";

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
            update: jest.fn(),
          })),
        },
        DeleteMovieReviewService,
      ],
    }).compile();

    service = module.get<DeleteMovieReviewService>(DeleteMovieReviewService);
    moviesReviewsRepository = module.get<jest.Mocked<MovieReviewsRepository>>(MovieReviewsRepository);
  });

  it.todo('should delete a movie review');
  it.todo('should throw MovieReviewNotFoundError when movie review does not exist');
});
