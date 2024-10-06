import { DataSourceOptions } from 'typeorm';

declare global {
  namespace NodeJS {
    interface ProcessEnv {
      [key: string]: string | undefined;
      DB_HOST: string;
      DB_PORT: number;
      DB_USER: string;
      DB_PASS: string;
      DB_DEFAULT: string;
      OMDB_API_KEY: string;
    }
  }
}
