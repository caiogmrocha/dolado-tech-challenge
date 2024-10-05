import { IsNotEmpty, MaxLength } from "class-validator";

export class CreateMovieReviewDto {
  @IsNotEmpty()
  @MaxLength(255)
  title: string;

  @IsNotEmpty()
  @MaxLength(500)
  notes: string;
}
