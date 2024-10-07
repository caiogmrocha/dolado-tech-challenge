import { ApiProperty } from "@nestjs/swagger";

import { IsNotEmpty, MaxLength } from "class-validator";

export class CreateMovieReviewControllerRequestBodyDto {
  @IsNotEmpty()
  @MaxLength(255)
  @ApiProperty({ maxLength: 255, description: 'The movie title' })
  title: string;

  @IsNotEmpty()
  @MaxLength(500)
  @ApiProperty({ maxLength: 500, description: 'The movie review notes' })
  notes: string;
}
