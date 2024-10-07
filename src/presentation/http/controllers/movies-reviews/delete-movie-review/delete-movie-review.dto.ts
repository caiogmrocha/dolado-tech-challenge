import { ApiProperty } from "@nestjs/swagger";

import { Transform } from "class-transformer";
import { IsNotEmpty, IsPositive } from "class-validator";

export class DeleteMovieReviewControllerRequestParamsDto {
  @IsNotEmpty()
  @Transform(({ value }) => parseInt(value))
  @IsPositive()
  @ApiProperty()
  public id: number;
}
