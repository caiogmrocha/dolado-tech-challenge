import { Injectable } from "@nestjs/common";

type CreateMovieReviewServiceParams = {
  title: string;
  notes: string;
}

type CreateMovieReviewServiceResponse = {
  reviewId: string;
};

@Injectable()
export class CreateMovieReviewService {
  constructor () {}

  public async execute(params: CreateMovieReviewServiceParams): Promise<CreateMovieReviewServiceResponse> {
    return;
  }
}
