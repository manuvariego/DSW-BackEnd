/**
 * Standalone Migration Runner Script
 *
 * This is a standalone script that runs migrations and exits.
 * Used in deployment pipelines (GitHub Actions, Docker, etc.)
 *
 * Usage:
 *   node dist/shared/db/migration-runner.js
 *
 * Environment variables needed:
 *   DB_HOST, DB_PORT, DB_NAME, DBUSER, DBPASS
 *   Or: DATABASE_URL
 */

import { MikroORM } from "@mikro-orm/core";
import { Migrator } from '@mikro-orm/migrations';
import { SqlHighlighter } from '@mikro-orm/sql-highlighter';
import { MySqlDriver } from '@mikro-orm/mysql';
import dotenv from 'dotenv';

dotenv.config();

/**
 * Main entry point - runs migrations then exits
 */
async function main() {
  console.log('Running migrations as standalone script...');

  const orm = await MikroORM.init({
    driver: MySqlDriver,
    dbName: process.env.DB_NAME || 'CocherasUTN',
    clientUrl: process.env.DATABASE_URL || `mysql://${process.env.DBUSER}:${process.env.DBPASS}@${process.env.DB_HOST || 'localhost'}:3306/${process.env.DB_NAME || 'CocherasUTN'}`,
    host: process.env.DB_HOST || 'localhost',
    port: Number(process.env.DB_PORT) || 3306,
    user: process.env.DBUSER,
    password: process.env.DBPASS,
    entities: ['./dist/**/*.entity.js'],
    extensions: [Migrator],
    highlighter: new SqlHighlighter(),
    debug: process.env.NODE_ENV !== 'production',
    migrations: {
      path: './dist/migrations',
      glob: '!(*.d).{js}',
    },
  });

  try {
    const migrator = orm.getMigrator();
    const pending = await migrator.getPendingMigrations();

    if (pending.length === 0) {
      console.log('No pending migrations. Database is up to date!');
    } else {
      console.log(`Found ${pending.length} pending migration(s):`);
      pending.forEach(m => console.log(`   - ${m.name}`));

      console.log('Running migrations...');
      await migrator.up();
      console.log('Migrations completed successfully!');
    }
  } catch (error) {
    console.error('Migration failed:', error);
    process.exit(1);
  } finally {
    await orm.close();
    console.log('Migration runner exiting...');
  }
}

// Run the script
main().catch(error => {
  console.error('Fatal error:', error);
  process.exit(1);
});
