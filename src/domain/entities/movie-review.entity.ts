import { Column, Entity, PrimaryGeneratedColumn } from "typeorm";

@Entity("movie_reviews")
export class MovieReview {
  constructor(partial: Partial<MovieReview>) {
    Object.assign(this, partial);
  }

  @PrimaryGeneratedColumn()
  id: number;

  @Column({ length: 255 })
  title: string;

  @Column({ type: 'decimal', precision: 2, scale: 1 })
  rating: number;

  @Column({ type: 'date' })
  releasedAt: Date;

  @Column('text')
  notes: string;
}
