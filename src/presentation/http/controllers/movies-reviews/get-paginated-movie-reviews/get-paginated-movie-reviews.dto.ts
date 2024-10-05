import { IsInt, IsNotEmpty, IsEnum, MaxLength } from "class-validator";

export class GetPaginatedMovieReviewsControllerDto {
  @IsNotEmpty()
  @IsInt()
  public limit: number;

  @IsNotEmpty()
  @IsInt()
  public offset: number;

  @IsNotEmpty()
  @MaxLength(255)
  public filterByTitle?: string;

  @IsNotEmpty()
  @MaxLength(255)
  public filterByAuthor?: string;

  @IsNotEmpty()
  @IsEnum(['rating', 'releasedAt'])
  public orderBy?: 'rating' | 'releasedAt';

  @IsNotEmpty()
  @IsEnum(['asc', 'desc'])
  public order?: 'asc' | 'desc';
}
