import path from 'node:path';

import { DataSource } from 'typeorm';

export const databaseProviders = [
  {
    provide: 'DATA_SOURCE',
    useFactory: async () => {
      const dataSource = new DataSource({
        type: process.env.DB_DRIVER,
        host: process.env.DB_HOST,
        port: process.env.DB_PORT,
        username: process.env.DB_USER,
        password: process.env.DB_PASS,
        database: process.env.DB_DEFAULT,
        entities: [
          path.join(__dirname, '..', '..', '..', 'domain', 'entities', '*.entity.js'),
        ],
        synchronize: true,
      });

      return dataSource.initialize();
    },
  },
];
