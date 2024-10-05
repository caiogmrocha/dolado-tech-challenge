import { Author } from "@/domain/entities/author.entity";

export interface AuthorsRepository {
  getAll(): Promise<Author[]>;
  create(authors: Author): Promise<number>;
}

export const AuthorsRepository = Symbol('AuthorsRepository');
