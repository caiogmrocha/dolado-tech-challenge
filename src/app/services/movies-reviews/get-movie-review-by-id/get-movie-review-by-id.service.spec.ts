import { MovieReviewsRepository } from "@/app/interfaces/repositories/movie-reviews.repository";
import { GetMovieReviewByIdService } from "./get-movie-review-by-id.service";
import { Test, TestingModule } from "@nestjs/testing";

describe('[Unit] GetPaginatedMovieReviewsService', () => {
  let service: GetMovieReviewByIdService;
  let moviesReviewsRepository: jest.Mocked<MovieReviewsRepository>;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        {
          provide: MovieReviewsRepository,
          useClass: jest.fn().mockImplementation(() => ({
            getPaginated: jest.fn(),
            getByTitle: jest.fn(),
            create: jest.fn(),
          })),
        },
        GetMovieReviewByIdService,
      ],
    }).compile();

    service = module.get<GetMovieReviewByIdService>(GetMovieReviewByIdService);
    moviesReviewsRepository = module.get<jest.Mocked<MovieReviewsRepository>>(MovieReviewsRepository);
  });

  it.todo('should return movie review by id');
  it.todo('should throw MovieReviewNotFoundException when movie review not found');
});
