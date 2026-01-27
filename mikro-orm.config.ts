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
  // entitiesTs is auto-detected by MikroORM CLI when loading .ts config (useTsNode: true)
  // Don't set it explicitly to avoid conflicts when using compiled JS config

  highlighter: new SqlHighlighter(),
  debug: process.env.NODE_ENV !== 'production',

  migrations: {
    path: 'dist/src/migrations',       // runtime: where compiled JS migrations are loaded from
    pathTs: 'src/migrations',          // development: where new TS migration files are created
  },

  schemaGenerator: {
    disableForeignKeys: false,
    createForeignKeyConstraints: true,
  },
});
