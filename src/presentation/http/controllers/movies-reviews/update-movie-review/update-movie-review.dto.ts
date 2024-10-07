import { ApiProperty } from "@nestjs/swagger";
import { Transform } from "class-transformer";
import { IsNotEmpty, IsNumber, IsPositive, IsString } from "class-validator";

export class UpdateMovieReviewControllerRequestParamsDto {
  @IsNotEmpty()
  @Transform(({ value }) => parseInt(value))
  @IsPositive()
  @ApiProperty()
  public id: number;
}

export class UpdateMovieReviewControllerRequestBodyDto {
  @IsNotEmpty()
  @IsString()
  @ApiProperty()
  notes: string;
}
