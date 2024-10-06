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

  @Column('boolean', { default: false })
  isDeleted: boolean;

  @Column('date')
  deletedAt: Date;

  @Column('date', { default: 'CURRENT_TIMESTAMP' })
  createdAt: Date;

  @Column('date', { onUpdate: 'CURRENT_TIMESTAMP', nullable: true })
  updatedAt: Date;

  @ManyToOne(() => Movie, movie => movie.reviews)
  movie: Movie;
}
