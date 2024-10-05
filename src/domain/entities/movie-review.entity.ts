import { Column, Entity, ManyToOne, PrimaryGeneratedColumn } from "typeorm";
import { Movie } from "./movie.entity";

@Entity("movie_reviews")
export class MovieReview {
  constructor(partial: Partial<MovieReview>) {
    Object.assign(this, partial);
  }

  @PrimaryGeneratedColumn()
  id: number;

  @Column('text')
  notes: string;

  @ManyToOne(() => Movie, movie => movie.reviews)
  movie: Movie;
}
