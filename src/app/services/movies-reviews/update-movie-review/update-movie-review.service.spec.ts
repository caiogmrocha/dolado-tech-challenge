import { Test, TestingModule } from "@nestjs/testing";

import { UpdateMovieReviewService } from "./update-movie-review.service";
import { MovieReviewsRepository } from "@/app/interfaces/repositories/movie-reviews.repository";

describe('[Unit] UpdateMovieReviewService', () => {
  let service: UpdateMovieReviewService;
  let moviesReviewsRepository: jest.Mocked<MovieReviewsRepository>;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        {
          provide: MovieReviewsRepository,
          useClass: jest.fn().mockImplementation(() => ({
            getByTitle: jest.fn(),
            create: jest.fn(),
          })),
        },
        UpdateMovieReviewService,
      ],
    }).compile();

    service = module.get<UpdateMovieReviewService>(UpdateMovieReviewService);
    moviesReviewsRepository = module.get<jest.Mocked<MovieReviewsRepository>>(MovieReviewsRepository);
  });

  it.todo('should update movie review');
  it.todo('should throw MovieReviewNotFoundException when movie review not found');
});
