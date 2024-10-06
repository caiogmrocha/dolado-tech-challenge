import { Transform } from "class-transformer";
import { IsNotEmpty, IsPositive } from "class-validator";

export class GetMovieReviewByIdControllerRequestDto {
  @IsNotEmpty()
  @Transform(({ value }) => parseInt(value))
  @IsPositive()
  public id: number;
}
