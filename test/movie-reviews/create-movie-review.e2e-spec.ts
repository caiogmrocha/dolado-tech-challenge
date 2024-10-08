import { HttpStatus, INestApplication, ValidationPipe } from "@nestjs/common";
import { ConfigModule } from "@nestjs/config";
import { Test, TestingModule } from "@nestjs/testing";
import { TypeOrmModule } from "@nestjs/typeorm";

import { DataSource } from "typeorm";

import { MovieReviewsModule } from "@/main/movie-reviews.module";
import { createDatabaseConnection } from "test/utils/create-database-connection";

describe('CreateMovieReviewController (e2e)', () => {
  let app: INestApplication;
  let datasource: DataSource;
  let database: string;

  beforeAll(async () => {
    await Test.createTestingModule({
      imports: [ConfigModule.forRoot({ envFilePath: '.env.test' })],
    }).compile();

    database = `test_${crypto.randomUUID()}`.replaceAll('-', '_').toLowerCase();

    datasource = await createDatabaseConnection();
  });

  beforeEach(async () => {
    await datasource.query('CREATE DATABASE ' + database);

    const moduleFixture: TestingModule = await Test.createTestingModule({
      imports: [
        ConfigModule.forRoot({
          envFilePath: '.env.test',
        }),
        TypeOrmModule.forRoot({
          type: 'mysql',
          host: process.env.DB_HOST,
          port: process.env.DB_PORT,
          username: process.env.DB_USER,
          password: process.env.DB_PASS,
          database: database,
          ssl: false,
          entities: [
            __dirname + '/../../src/domain/entities/*.entity.{ts,js}',
          ],
          synchronize: true,
        }),
        MovieReviewsModule,
      ],
    }).compile();

    app = moduleFixture.createNestApplication();

    app.useGlobalPipes(new ValidationPipe({
      errorHttpStatusCode: HttpStatus.UNPROCESSABLE_ENTITY,
      transform: true,
    }));

    await app.init();
  });

  afterEach(async () => {
    await datasource.query('DROP DATABASE IF EXISTS ' + database);
  });

  afterAll(async () => {
    await datasource.destroy();
    await app.close();
  });

  it.todo('POST /movies-reviews | should return 201 when creating a movie review');
  it.todo('POST /movies-reviews | should return 409 when creating a movie review that already exists');
  it.todo('POST /movies-reviews | should return 422 when creating a movie review with invalid data');
});
