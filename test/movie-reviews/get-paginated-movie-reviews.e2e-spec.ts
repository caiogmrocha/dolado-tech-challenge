import * as crypto from 'crypto';

import { Test, TestingModule } from '@nestjs/testing';
import { HttpStatus, INestApplication, ValidationPipe } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ConfigModule } from '@nestjs/config';

import * as request from 'supertest';
import { DataSource } from 'typeorm';
import { faker } from '@faker-js/faker';

import { MovieReviewsModule } from '@/main/movie-reviews.module';

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

  describe('GET /movie-reviews | should return 200', () => {
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
          .expect(HttpStatus.CREATED);
      }

      const limit = faker.number.int({ min: 1, max: 5 });

      await request(app.getHttpServer())
        .get(`/movie-reviews?limit=${limit}&offset=0`)
        .expect(HttpStatus.OK)
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
          .expect(HttpStatus.CREATED);
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
        .expect(HttpStatus.OK)
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
          .expect(HttpStatus.CREATED);
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
        .expect(HttpStatus.OK)
        .expect((response) => {
          expect(response.body).toHaveLength(limit);

          let previousRating = response.body[0].rating;

          for (const movieReview of response.body) {
            expect(movieReview.rating).toBeGreaterThanOrEqual(previousRating);
            previousRating = movieReview.rating;
          }
        });
    });

    it('GET /movie-reviews?limit=5&offset=0&orderBy=releasedAt&order=asc | should return 200 and ordered by releasedAt in ascending order', async () => {
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
          .expect(HttpStatus.CREATED);
      }

      const limit = 5;

      await request(app.getHttpServer())
        .get(`/movie-reviews`)
        .query({
          limit,
          offset: 0,
          orderBy: 'releasedAt',
          order: 'asc'
        })
        .expect(HttpStatus.OK)
        .expect((response) => {
          expect(response.body).toHaveLength(limit);

          let previousReleasedAt = new Date(response.body[0].releasedAt);

          for (const movieReview of response.body) {
            const releasedAt = new Date(movieReview.releasedAt);

            expect(releasedAt.getTime()).toBeGreaterThanOrEqual(previousReleasedAt.getTime());
            previousReleasedAt = releasedAt;
          }
        });
    });

    it('GET /movie-reviews?limit=5&offset=0&orderBy=releasedAt&order=desc | should return 200 and ordered by releasedAt in descending order', async () => {
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
          .expect(HttpStatus.CREATED);
      }

      const limit = 5;

      await request(app.getHttpServer())
        .get(`/movie-reviews`)
        .query({
          limit,
          offset: 0,
          orderBy: 'releasedAt',
          order: 'desc'
        })
        .expect(HttpStatus.OK)
        .expect((response) => {
          expect(response.body).toHaveLength(limit);

          let previousReleasedAt = new Date(response.body[0].releasedAt);

          for (const movieReview of response.body) {
            const releasedAt = new Date(movieReview.releasedAt);

            expect(releasedAt.getTime()).toBeLessThanOrEqual(previousReleasedAt.getTime());
            previousReleasedAt = releasedAt;
          }
        });
    });

    it('GET /movie-reviews?limit=5&offset=0&filterByTitle=Dune | should return 200 and filtered by title', async () => {
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
          .expect(HttpStatus.CREATED);
      }

      const limit = 5;
      const filterByTitle = 'Dune';

      await request(app.getHttpServer())
        .get(`/movie-reviews`)
        .query({
          limit,
          offset: 0,
          filterByTitle: filterByTitle
        })
        .expect(HttpStatus.OK)
        .expect((response) => {
          expect(response.body).toHaveLength(1);
          expect(response.body[0].title).toBe(filterByTitle);
        });
    });

    it('GET /movie-reviews?limit=5&offset=0&filterByAuthor=Frank+Herbert | should return 200 and filtered by author', async () => {
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
          .expect(HttpStatus.CREATED);
      }

      const limit = 5;

      // This is the author of the show "Dune"
      const filterByAuthor = 'Frank Herbert';

      await request(app.getHttpServer())
        .get(`/movie-reviews`)
        .query({
          limit,
          offset: 0,
          filterByAuthor: filterByAuthor
        })
        .expect(HttpStatus.OK)
        .expect((response) => {
          expect(response.body).toHaveLength(1);
          expect(response.body[0].title).toBe('Dune');
        });
    });
  });

  it('GET /movie-reviews | should return 422 when the query parameters are invalid', async () => {
    await request(app.getHttpServer())
      .get(`/movie-reviews`)
      .expect(HttpStatus.UNPROCESSABLE_ENTITY)
      .expect((response) => {
        expect(response.body.message.some((message: string) => message.includes('limit'))).toBe(true);
      });
  });
});
