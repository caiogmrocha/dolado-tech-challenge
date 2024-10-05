import { Column, Entity, JoinTable, ManyToMany, PrimaryGeneratedColumn } from "typeorm";
import { Movie } from "./movie.entity";

@Entity("authors")
export class Author {
  constructor(partial: Partial<Author>) {
    Object.assign(this, partial);
  }

  @PrimaryGeneratedColumn()
  id: number;

  @Column({ length: 255 })
  name: string;
}
