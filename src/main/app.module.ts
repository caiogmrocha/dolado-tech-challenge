import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { TypeOrmModule } from '@nestjs/typeorm';
import { MovieReviewsModule } from './movie-reviews.module';

@Module({
  imports: [
    ConfigModule.forRoot(),
    TypeOrmModule.forRoot({
      type: 'mysql',
      host: process.env.DB_HOST,
      port: process.env.DB_PORT,
      username: process.env.DB_USER,
      password: process.env.DB_PASS,
      database: process.env.DB_DEFAULT,
      ssl: false,
      entities: [
        __dirname + '/../domain/entities/*.entity.{ts,js}',
      ],
      synchronize: true,
    }),
    MovieReviewsModule,
  ],
  controllers: [],
  providers: [],
})
export class AppModule {}
