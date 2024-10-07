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

  it('GET /movie-reviews?limit=5&offset=0 | should return 200 and an array of 5 movie reviews', async () => {
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

  it('GET /movie-reviews?limit=5&offset=5&orderBy=rating&order=desc | should return 200 and ordered by rating in descending order', async () => {
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

    const limit = 5;

    await request(app.getHttpServer())
      .get(`/movie-reviews`)
      .query({
        limit,
        offset: 0,
        orderBy: 'rating',
        order: 'desc'
      })
      .expect(200)
      .expect((response) => {
        expect(response.body).toHaveLength(limit);

        let previousRating = response.body[0].rating;

        for (const movieReview of response.body) {
          expect(movieReview.rating).toBeLessThanOrEqual(previousRating);
          previousRating = movieReview.rating;
        }
      });
  });

  it('GET /movie-reviews?limit=5&offset=0&orderBy=rating&order=asc | should return 200 and ordered by rating in ascending order', async () => {
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

    const limit = 5;

    await request(app.getHttpServer())
      .get(`/movie-reviews`)
      .query({
        limit,
        offset: 0,
        orderBy: 'rating',
        order: 'asc'
      })
      .expect(200)
      .expect((response) => {
        expect(response.body).toHaveLength(limit);

        let previousRating = response.body[0].rating;

        for (const movieReview of response.body) {
          expect(movieReview.rating).toBeGreaterThanOrEqual(previousRating);
          previousRating = movieReview.rating;
        }
      });
  });

  it.todo('GET /movie-reviews?limit=5&offset=0&orderBy=releasedAt&order=asc | should return 200 and ordered by releasedAt in ascending order');
  it.todo('GET /movie-reviews?limit=5&offset=0&orderBy=releasedAt&order=desc | should return 200 and ordered by releasedAt in descending order');
  it.todo('GET /movie-reviews?limit=5&offset=0&filterByTitle=The+Matrix | should return 200 and filtered by title');
  it.todo('GET /movie-reviews?limit=5&offset=0&filterByAuthor=John+Doe | should return 200 and filtered by author');
});
