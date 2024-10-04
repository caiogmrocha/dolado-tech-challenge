import { DataSourceOptions } from 'typeorm';

declare global {
  namespace NodeJS {
    interface ProcessEnv {
      [key: string]: string | undefined;
      DB_DRIVER: Extract<DataSourceOptions['type'], 'mysql'>;
      DB_HOST: string;
      DB_PORT: number;
      DB_USER: string;
      DB_PASS: string;
      DB_DEFAULT: string;
    }
  }
}
