import { Transform } from "class-transformer";
import { IsNotEmpty, IsNumber, IsPositive, IsString } from "class-validator";

export class UpdateMovieReviewControllerRequestParamsDto {
  @IsNotEmpty()
  @Transform(({ value }) => parseInt(value))
  @IsPositive()
  public id: number;
}

export class UpdateMovieReviewControllerRequestBodyDto {
  @IsNotEmpty()
  @IsString()
  notes: string;
}
