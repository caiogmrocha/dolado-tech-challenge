import { DataSource } from 'typeorm';

export async function createDatabaseConnection() {
  const datasource = new DataSource({
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

  return datasource;
}
