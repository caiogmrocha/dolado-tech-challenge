import { AuthorsRepository } from "@/app/interfaces/repositories/authors.repository";
import { Author } from "@/domain/entities/author.entity";
import { InjectRepository } from "@nestjs/typeorm";
import { Repository } from "typeorm";

export class TypeormAuthorsRepository implements AuthorsRepository {
  constructor (
    @InjectRepository(Author) private readonly authorRepository: Repository<Author>,
  ) {}

  public async getAll(): Promise<Author[]> {
    return this.authorRepository.find();
  }

  public async create(author: Author): Promise<number> {
    await this.authorRepository.save(author);

    return author.id;
  }
}
