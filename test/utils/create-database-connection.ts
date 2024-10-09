import { DataSource } from 'typeorm';

export class GetDatabaseConnectionSingleton {
  private static instance: DataSource;

  public static async getInstance(): Promise<DataSource> {
    if (!GetDatabaseConnectionSingleton.instance) {
      GetDatabaseConnectionSingleton.instance = new DataSource({
        type: 'mysql',
        host: process.env.DB_HOST,
        port: process.env.DB_PORT,
        username: process.env.DB_USER,
        password: process.env.DB_PASS,
        database: process.env.DB_DEFAULT,
        ssl: false,
        entities: [
          __dirname + '/../../src/domain/entities/*.entity.{ts,js}',
        ],
        synchronize: true,
      });
    }

    await GetDatabaseConnectionSingleton.instance.initialize();

    return GetDatabaseConnectionSingleton.instance;
  }
}
