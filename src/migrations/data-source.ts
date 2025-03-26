import * as dotenv from 'dotenv';
import { join } from 'path';
import { DataSource } from 'typeorm';

import { APP_SETTINGS } from '../app/settings/app-settings';

dotenv.config();

const entitiesPath = join(
  __dirname,
  '..',
  '**',
  'entities',
  '*.entity.{ts,js}',
);

const migrationsPath = join(
  __dirname,
  '..',
  '**',
  'migrations',
  'files',
  '*.{ts,js}',
);

export default new DataSource({
  type: 'postgres',
  host: process.env[APP_SETTINGS.ARTICLE_DB_HOST],
  port: +process.env[APP_SETTINGS.ARTICLE_DB_PORT]!,
  username: process.env[APP_SETTINGS.ARTICLE_DB_USER],
  password: process.env[APP_SETTINGS.ARTICLE_DB_PASSWORD],
  database: process.env[APP_SETTINGS.ARTICLE_DB_NAME],
  entities: [entitiesPath],
  migrations: [migrationsPath],
  synchronize: false,
  logging: true,
  migrationsRun: false,
});
