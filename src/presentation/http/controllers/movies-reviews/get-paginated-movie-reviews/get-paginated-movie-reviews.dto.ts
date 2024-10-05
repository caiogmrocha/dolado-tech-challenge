import { IsInt, IsNotEmpty, IsEnum, MaxLength, IsNumberString, IsPositive, IsOptional, isInt } from "class-validator";
import { Transform } from "class-transformer";

export class GetPaginatedMovieReviewsControllerDto {
  @IsNotEmpty()
  @Transform(({ value }) => value ? parseInt(value) : 10)
  @IsPositive()
  public limit: number;

  @IsNotEmpty()
  @Transform(({ value }) => value ? parseInt(value) : 0)
  @IsInt()
  public offset: number;

  @IsOptional()
  @MaxLength(255)
  public filterByTitle?: string;

  @IsOptional()
  @MaxLength(255)
  public filterByAuthor?: string;

  @IsOptional()
  @IsEnum(['rating', 'releasedAt'])
  public orderBy?: 'rating' | 'releasedAt';

  @IsOptional()
  @IsEnum(['asc', 'desc'])
  public order?: 'asc' | 'desc';
}
