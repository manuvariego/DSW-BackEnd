import { orm } from './orm.js';
import { Migrator } from '@mikro-orm/migrations';

/**
 * Migration Functions Module
 *
 * These functions use the app's existing ORM connection.
 * They are imported by app.ts to run migrations at startup.
 *
 * NOTE: This is different from migration-runner.ts which is a standalone script.
 */

/**
 * Run pending migrations using the app's ORM connection
 * This is called by app.ts when RUN_MIGRATIONS=true
 */
export const runMigrations = async () => {
  const migrator = orm.getMigrator();
  const migrations = await migrator.getPendingMigrations();

  if (migrations.length > 0) {
    console.log(`Running ${migrations.length} pending migration(s)...`);
    await migrator.up();
    console.log('Migrations completed successfully!');
  } else {
    console.log('No pending migrations.');
  }
};

/**
 * Get migration status (for monitoring/debugging)
 */
export const getMigrationStatus = async () => {
  const migrator = orm.getMigrator();
  const executed = await migrator.getExecutedMigrations();
  const pending = await migrator.getPendingMigrations();

  return {
    executed: executed.length,
    pending: pending.length,
    executedMigrations: executed,
    pendingMigrations: pending,
  };
};
