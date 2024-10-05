import { Column, PrimaryGeneratedColumn } from "typeorm";

export class MovieReview {
  constructor(partial: Partial<MovieReview>) {
    Object.assign(this, partial);
  }

  @PrimaryGeneratedColumn()
  id: number;

  @Column({ length: 500 })
  title: string;

  @Column()
  rating: number;

  @Column()
  releasedAt: Date;

  @Column('text')
  notes: string;
}
