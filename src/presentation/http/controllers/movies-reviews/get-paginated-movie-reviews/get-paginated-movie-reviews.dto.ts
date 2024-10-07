import { IsInt, IsNotEmpty, IsEnum, MaxLength, IsNumberString, IsPositive, IsOptional, isInt } from "class-validator";
import { Transform } from "class-transformer";
import { ApiProperty } from "@nestjs/swagger";

export class GetPaginatedMovieReviewsControllerRequestQueryDto {
  @IsNotEmpty()
  @Transform(({ value }) => parseInt(value))
  @IsPositive()
  @ApiProperty()
  public limit: number;

  @IsNotEmpty()
  @Transform(({ value }) => parseInt(value))
  @IsInt()
  @ApiProperty()
  public offset: number;

  @IsOptional()
  @MaxLength(255)
  @ApiProperty()
  public filterByTitle?: string;

  @IsOptional()
  @MaxLength(255)
  @ApiProperty()
  public filterByAuthor?: string;

  @IsOptional()
  @IsEnum(['rating', 'releasedAt'])
  @ApiProperty({ enum: ['rating', 'releasedAt'] })
  public orderBy?: 'rating' | 'releasedAt';

  @IsOptional()
  @IsEnum(['asc', 'desc'])
  @ApiProperty({ enum: ['asc', 'desc'] })
  public order?: 'asc' | 'desc';
}
