import { HttpStatus, INestApplication, ValidationPipe } from "@nestjs/common";
import { ConfigModule } from "@nestjs/config";
import { Test, TestingModule } from "@nestjs/testing";
import { TypeOrmModule } from "@nestjs/typeorm";

import * as request from 'supertest';
import { DataSource } from "typeorm";

import { MovieReviewsModule } from "@/main/movie-reviews.module";
import { GetDatabaseConnectionSingleton } from "../utils/create-database-connection";

describe('UpdateMovieReviewController (e2e)', () => {
  let app: INestApplication;
  let datasource: DataSource;
  let database: string;

  beforeAll(async () => {
    await Test.createTestingModule({
      imports: [ConfigModule.forRoot({ envFilePath: '.env.test' })],
    }).compile();

    database = `test_${crypto.randomUUID()}`.replaceAll('-', '_').toLowerCase();

    datasource = await GetDatabaseConnectionSingleton.getInstance();
  });

  beforeEach(async () => {
    await datasource.query('CREATE DATABASE ' + database);

    const moduleFixture: TestingModule = await Test.createTestingModule({
      imports: [
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

  it('PUT /movie-reviews/:id | should return 204 when updating a movie review', async () => {
    const movieReviewData = {
      title: 'Inception',
      rating: 5,
      releasedAt: '2010-07-16',
      notes: 'A movie about dreams',
    };

    const response = await request(app.getHttpServer())
      .post('/movie-reviews')
      .send(movieReviewData)
      .expect(HttpStatus.CREATED);

    const updatedMovieReviewData = {
      notes: 'A movie about dreams',
    };

    await request(app.getHttpServer())
      .put(`/movie-reviews/${response.body.reviewId}`)
      .send(updatedMovieReviewData)
      .expect(HttpStatus.NO_CONTENT);
  });

  it.todo('PUT /movie-reviews/:id | should return 404 when movie review does not exist');
  it.todo('PUT /movie-reviews/:id | should return 422 when payload is invalid');
});
