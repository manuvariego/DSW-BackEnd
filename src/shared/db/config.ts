import { Migrator } from '@mikro-orm/migrations';
import { SqlHighlighter } from '@mikro-orm/sql-highlighter';
import { MySqlDriver } from '@mikro-orm/mysql';

/**
 * Shared MikroORM configuration
 * Used by both orm.ts and run-migrations.ts
 */
export const getMikroORMConfig = () => ({
  driver: MySqlDriver,
  dbName: process.env.DB_NAME || 'CocherasUTN',
  clientUrl: process.env.DATABASE_URL || `mysql://${process.env.DBUSER}:${process.env.DBPASS}@${process.env.DB_HOST || 'localhost'}:3306/${process.env.DB_NAME || 'CocherasUTN'}`,
  host: process.env.DB_HOST || 'localhost',
  port: Number(process.env.DB_PORT) || 3306,
  user: process.env.DBUSER,
  password: process.env.DBPASS,

  highlighter: new SqlHighlighter(),
  debug: process.env.NODE_ENV !== 'production',
  extensions: [Migrator],

  migrations: {
    path: './dist/migrations',
    glob: '!(*.d).{js}',
  },
});
