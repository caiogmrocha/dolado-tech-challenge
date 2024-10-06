import { Column, CreateDateColumn, DeleteDateColumn, Entity, JoinTable, ManyToMany, OneToMany, PrimaryGeneratedColumn, UpdateDateColumn } from "typeorm";

import { Author } from "./author.entity";
import { MovieReview } from "./movie-review.entity";

@Entity()
export class Movie {
  constructor(partial: Partial<Movie>) {
    Object.assign(this, partial);
  }

  @PrimaryGeneratedColumn()
  id: number;

  @Column({ length: 255 })
  title: string;

  @Column({
    type: 'decimal',
    precision: 2,
    scale: 1,
    transformer: {
      to: (value: number) => value,
      from: (value: string) => parseFloat(value),
    }
  })
  rating: number;

  @Column({ type: 'date' })
  releasedAt: Date;

  @DeleteDateColumn()
  deletedAt: Date;

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;

  @ManyToMany(() => Author)
  @JoinTable({ name: 'movies_authors' })
  authors: Author[];

  @OneToMany(() => MovieReview, movieReview => movieReview.movie)
  reviews: MovieReview[];
}
