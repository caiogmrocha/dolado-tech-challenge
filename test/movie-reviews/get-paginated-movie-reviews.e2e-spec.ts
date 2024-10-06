import * as crypto from 'crypto';

import { Test, TestingModule } from '@nestjs/testing';
import { INestApplication } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ConfigModule } from '@nestjs/config';

import * as request from 'supertest';
import { DataSource } from 'typeorm';

import { MovieReviewsModule } from '@/main/movie-reviews.module';
import { MovieReviewsRepository } from '@/app/interfaces/repositories/movie-reviews.repository';
import { faker } from '@faker-js/faker/.';

describe('GetPaginatedMovieReviewsController (e2e)', () => {
  let app: INestApplication;
  let datasource: DataSource;
  let database: string;

  beforeAll(async () => {
    await Test.createTestingModule({
      imports: [ConfigModule.forRoot({ envFilePath: '.env.test' })],
    }).compile();

    database = `test_${crypto.randomUUID()}`.replaceAll('-', '_').toLowerCase();

    if (!datasource) {
      datasource = new DataSource({
        type: 'mysql',
        host: process.env.DB_HOST,
        port: process.env.DB_PORT,
        username: process.env.DB_USER,
        password: process.env.DB_PASS,
        database: 'public',
        ssl: false,
        entities: [
          __dirname + '/../../src/domain/entities/*.entity.{ts,js}',
        ],
        synchronize: true,
      });

      await datasource.initialize();
    }
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

    await app.init();
  });

  afterEach(async () => {
    await datasource.query('DROP DATABASE IF EXISTS ' + database);
  });

  afterAll(async () => {
    await datasource.destroy();
    await app.close();
  });

  it('GET /movie-reviews?limit=5&offset=0 | should return 200', async () => {
    const movieReviewsToBeInserted = [
      {
        title: 'The Matrix',
        notes: faker.lorem.words(10),
      },
      {
        title: 'The Matrix Reloaded',
        notes: faker.lorem.words(10),
      },
      {
        title: 'The Matrix Revolutions',
        notes: faker.lorem.words(10),
      },
      {
        title: 'The Matrix Resurrections',
        notes: faker.lorem.words(10),
      },
      {
        title: 'Avatar',
        notes: faker.lorem.words(10),
      },
      {
        title: 'Dune',
        notes: faker.lorem.words(10),
      }
    ];

    for (const movieReview of movieReviewsToBeInserted) {
      await request(app.getHttpServer())
        .post('/movie-reviews')
        .send(movieReview)
        .expect(201);
    }

    const limit = faker.number.int({ min: 1, max: 5 });

    await request(app.getHttpServer())
      .get(`/movie-reviews?limit=${limit}&offset=0`)
      .expect(200)
      .expect((response) => {
        expect(response.body).toHaveLength(limit);
      });
  });

  it.todo('GET /movie-reviews?limit=5&offset=5&orderBy=rating&order=DESC | should return 200');
  it.todo('GET /movie-reviews?limit=5&offset=5&orderBy=rating&order=ASC | should return 200');
  it.todo('GET /movie-reviews?limit=5&offset=5&orderBy=releasedAt&order=ASC | should return 200');
  it.todo('GET /movie-reviews?limit=5&offset=5&orderBy=releasedAt&order=DESC | should return 200');
  it.todo('GET /movie-reviews?limit=5&offset=5&filterByTitle=The+Matrix | should return 200');
  it.todo('GET /movie-reviews?limit=5&offset=5&filterByAuthor=John+Doe | should return 200');
});
