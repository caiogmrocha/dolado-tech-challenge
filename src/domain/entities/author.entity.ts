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

  @Column('boolean', { default: false })
  isDeleted: boolean;

  @Column('date')
  deletedAt: Date;

  @Column('date', { default: 'CURRENT_TIMESTAMP' })
  createdAt: Date;

  @Column('date', { onUpdate: 'CURRENT_TIMESTAMP', nullable: true })
  updatedAt: Date;
}
