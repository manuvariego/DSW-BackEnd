# Database Migrations Guide

This guide explains how to use MikroORM migrations for production deployments.

## Overview

This project uses MikroORM migrations to manage database schema changes. Migrations are version-controlled SQL scripts that allow you to safely evolve your database schema over time.

## Key Changes

✅ **Removed `syncSchema()`** - The `syncSchema()` function has been removed. It auto-synced the database schema, which is dangerous in production.

✅ **Added Migrations** - Using proper migrations that can be version-controlled and reviewed.

✅ **Fixed TypeScript Build** - Fixed duplicate entity compilation issue in `tsconfig.json`.

## Development Workflow

### 1. Creating a New Migration

When you make changes to your entities:

```bash
pnpm migration:create --name=my_new_feature
```

This creates a new migration file in the `migrations/` directory.

### 2. Running Migrations Locally

To run pending migrations:

```bash
# Run all pending migrations
pnpm migration:up

# Or run the latest migration
pnpm migration:latest

# Rollback the last migration
pnpm migration:down
```

## Production Deployment

### Option 1: Run Migrations as Separate Step (Recommended)

Before deploying new code:

```bash
# 1. Set production environment variables
export NODE_ENV=production
export DB_NAME=your_production_db
export DBUSER=your_db_user
export DBPASS=your_db_password
export DB_HOST=your_db_host
export DB_PORT=3306

# 2. Build and run migrations
pnpm migrate:prod

# 3. Start the application
pnpm start
```

### Option 2: Run Migrations on Startup

You can modify `src/app.ts` to run migrations automatically on startup:

```typescript
import { runMigrations } from './shared/db/migrate.js';

// Before starting the server
await runMigrations();

app.listen(port, () => {
  console.log('Server running...');
});
```

### Example Deployment Scripts

**Railway/Render/Vercel:**
Add a build script:
```json
{
  "scripts": {
    "deploy": "pnpm migrate:prod && pnpm start"
  }
}
```

**Docker:**
```dockerfile
# In your Dockerfile
RUN pnpm build
RUN pnpm migrate:prod
CMD ["pnpm", "start"]
```

## Environment Variables

Create a `.env` file in production with these variables:

```bash
# Database
DB_NAME=your_database_name
DB_HOST=your_database_host
DB_PORT=3306
DBUSER=your_database_user
DBPASS=your_database_password

# Or use connection string
DATABASE_URL=mysql://user:password@host:port/database

# Application
NODE_ENV=production
PORT=3000
JWT_SECRET=your_jwt_secret
```

See `.env.example` for a complete template.

## Migration Files

Migration files are stored in the `migrations/` directory and should be committed to version control.

Each migration file has:
- `up()` method: Applies the migration
- `down()` method: Rolls back the migration

## Troubleshooting

### Migration fails in production

1. Check database credentials are correct
2. Ensure the database exists
3. Check migration file permissions
4. Review logs for specific error messages

### "Duplicate entity names" error

This was a fixed issue with the build configuration. Ensure `tsconfig.json` only includes `src/**/*` and excludes `dist`.

### Need to reset database (development only)

```bash
# WARNING: This deletes all data!
pnpm migration:fresh
```

## Best Practices

1. **Always review migrations** before committing
2. **Test migrations** in a staging environment first
3. **Never modify existing migrations** - create a new one instead
4. **Keep migrations reversible** by implementing `down()` methods
5. **Run migrations before deploying code** that depends on new schema
6. **Back up production database** before running migrations

## CI/CD Integration

### GitHub Actions Example

```yaml
- name: Run migrations
  run: |
    pnpm migrate:prod
  env:
    DATABASE_URL: ${{ secrets.DATABASE_URL }}
```

### GitLab CI Example

```yaml
run_migrations:
  script:
    - pnpm migrate:prod
  variables:
    DATABASE_URL: $DATABASE_URL
```

## Additional Resources

- [MikroORM Migrations Documentation](https://mikro-orm.io/docs/migrations)
- [MikroORM Deployment Guide](https://mikro-orm.io/docs/deployment)
