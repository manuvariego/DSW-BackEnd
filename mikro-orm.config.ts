import { defineConfig } from '@mikro-orm/core';
import { MySqlDriver } from '@mikro-orm/mysql';
import { SqlHighlighter } from '@mikro-orm/sql-highlighter';
import dotenv from 'dotenv';

dotenv.config();

export default defineConfig({
  driver: MySqlDriver,
  dbName: process.env.DB_NAME || 'CocherasUTN',
  clientUrl: process.env.DATABASE_URL || `mysql://${process.env.DBUSER}:${process.env.DBPASS}@localhost:3306/${process.env.DB_NAME || 'CocherasUTN'}`,
  host: process.env.DB_HOST || 'localhost',
  port: Number(process.env.DB_PORT) || 3306,
  user: process.env.DBUSER,
  password: process.env.DBPASS,

  entities: ['dist/**/*.entity.js'],
  entitiesTs: process.env.NODE_ENV === 'production' ? undefined : ['src/**/*.entity.ts'],

  highlighter: new SqlHighlighter(),
  debug: process.env.NODE_ENV !== 'production',

  migrations: {
    path: 'dist/src/migrations',
    pathTs: process.env.NODE_ENV === 'production' ? undefined : 'src/migrations',
  },

  schemaGenerator: {
    disableForeignKeys: false,
    createForeignKeyConstraints: true,
  },
});
