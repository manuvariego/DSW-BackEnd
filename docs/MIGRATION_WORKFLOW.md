# Database Migration Workflow Guide

This guide explains how to work with migrations when making database changes.

## What Are Migrations?

Migrations are version-controlled files that describe changes to your database schema over time. Each migration file contains:
- **up()** - How to apply the change
- **down()** - How to rollback the change

## When Do You Need a New Migration?

You need to create a migration when you:

### ✅ Create a New Migration When:
1. **Add a new entity** (new table)
2. **Add a new property** to an entity (new column)
3. **Remove a property** from an entity (drop column)
4. **Change a property type** (modify column)
5. **Add/remove relationships** (foreign keys)
6. **Add indexes** or **unique constraints**
7. **Rename tables or columns**

### ❌ Don't Create Migrations For:
- Data changes (INSERT/UPDATE/DELETE)
- Temporary queries
- One-time fixes (use a seed script instead)

## Step-by-Step Workflow

### Example: Adding a New Column to User Entity

#### Step 1: Modify Your Entity

```typescript
// src/User/user.entity.ts
import { Entity, Property } from '@mikro-orm/core';

export class User extends baseEntity {
    // ... existing properties ...

    @Property()  // ← NEW PROPERTY ADDED
    phoneNumber!: string
}
```

#### Step 2: Create a Migration

```bash
pnpm migration:create --name=add_phone_number_to_users
```

This creates a new file in `migrations/`:
```
migrations/1234567890-add_phone_number_to_users.ts
```

#### Step 3: Edit the Migration File

The migration file will be pre-filled with the detected changes:

```typescript
// migrations/1234567890-add_phone_number_to_users.ts
import { Migration } from '@mikro-orm/migrations';

export class AddPhoneNumberToUsers extends Migration {

  async up(): Promise<void> {
    this.addSql('alter table `user` add column `phone_number` varchar(255) not null;');
  }

  async down(): Promise<void> {
    this.addSql('alter table `user` drop column `phone_number`;');
  }

}
```

**Review the SQL and adjust if needed!**

#### Step 4: Test the Migration Locally

```bash
# Apply the migration
pnpm migration:up

# Check your database - the column should be added
# If something is wrong, rollback:
pnpm migration:down
```

#### Step 5: Commit the Changes

```bash
git add .
git commit -m "Add phone number field to users"
git push
```

Include:
- Modified entity files
- New migration file
- Any related code changes

#### Step 6: Deploy to Production

**Option A: Manual Deployment**
```bash
# On your server
git pull
pnpm build
pnpm migrate:prod  # Runs migrations
pnpm start         # Starts the app
```

**Option B: Docker**
```bash
docker-compose up --build
docker-compose --profile migrations up migrator  # Run migrations
docker-compose up -d                             # Start app
```

**Option C: Cloud Platform (Railway/Render)**
- The build command `pnpm migrate:prod && pnpm start` handles everything

## Common Migration Scenarios

### Scenario 1: Add a New Entity

```typescript
// src/Profile/profile.entity.ts (NEW FILE)
@Entity()
export class Profile {
    @PrimaryKey()
    id!: number

    @Property()
    bio!: string

    @ManyToOne(() => User)
    user!: User
}
```

```bash
pnpm migration:create --name=add_profiles_table
```

Result:
```sql
CREATE TABLE `profile` (
  `id` int unsigned not null auto_increment primary key,
  `bio` varchar(255) not null,
  `user_id` int unsigned not null
);
ALTER TABLE `profile` ADD CONSTRAINT `profile_user_id_foreign` FOREIGN KEY (`user_id`) REFERENCES `user` (`id`);
```

### Scenario 2: Change Column Type

```typescript
// Before:
@Property()
name!: string  // varchar(255)

// After:
@Property({ columnType: 'text' })
name!: string  // text type
```

```bash
pnpm migration:create --name=change_user_name_to_text
```

Result:
```sql
ALTER TABLE `user` MODIFY COLUMN `name` text not null;
```

### Scenario 3: Add Index

```typescript
@Entity()
export class User extends baseEntity {
    @Property()
    @Index()  // ← NEW INDEX
    email!: string
}
```

```bash
pnpm migration:create --name=add_user_email_index
```

Result:
```sql
CREATE INDEX `user_email_index` ON `user` (`email`);
```

## Production Deployment Workflow

### Development Team Workflow

```
┌─────────────────┐
│  Developer A    │
│  Adds feature   │
└────────┬────────┘
         │
         ▼
┌─────────────────┐
│  Create & Test  │
│  Migration      │
└────────┬────────┘
         │
         ▼
┌─────────────────┐
│  Commit & Push  │
│  to GitHub      │
└────────┬────────┘
         │
         ▼
┌─────────────────┐
│  CI/CD Pipeline │
│  Run Tests      │
└────────┬────────┘
         │
         ▼
┌─────────────────┐
│  Deploy to Staging│
│  Run Migrations │
└────────┬────────┘
         │
         ▼
┌─────────────────┐
│  Manual Testing │
└────────┬────────┘
         │
         ▼
┌─────────────────┐
│  Deploy to Prod │
│  Run Migrations │
└─────────────────┘
```

### Deployment Checklist

Before deploying to production:

- [ ] All migrations tested locally
- [ ] All migrations tested on staging
- [ ] Database backup created (for major changes)
- [ ] Migration files reviewed
- [ ] Rollback plan documented
- [ ] Monitoring/alerting configured

## Best Practices

### ✅ DO:
1. **Create small, focused migrations** - One logical change per migration
2. **Test migrations both ways** - Test `up()` AND `down()`
3. **Make migrations reversible** - Always implement `down()` method
4. **Review generated SQL** - Don't blindly trust auto-generated migrations
5. **Backup before major changes** - Especially when dropping columns/tables
6. **Use transactions** - MikroORM does this by default

### ❌ DON'T:
1. **Don't modify existing migrations** - Create a new one instead
2. **Don't put data in migrations** - Use seed scripts for data
3. **Don't assume migrations are fast** - Test on large datasets
4. **Don't skip testing** - Always test on staging first
5. **Don't break backwards compatibility** - Prefer additive changes

## Troubleshooting

### Migration Failed Mid-Way

If a migration fails, it will be partially applied. MikroORM tracks which migrations ran.

```bash
# Check migration status
pnpm migration:status  # Shows executed vs pending

# Fix the issue in the migration file
# Then rerun - MikroORM will skip already executed migrations
pnpm migration:up
```

### Need to Rollback

```bash
# Rollback last migration
pnpm migration:down

# Rollback specific migration
pnpm migration:down --to=1234567890
```

### Conflict in Production

If the database schema doesn't match migrations (e.g., manual changes):

```bash
# Create a baseline migration from current state
pnpm migration:create --initial
```

## Docker-Specific Workflow

### Development with Docker Compose

```bash
# Start everything
docker-compose up

# Run migrations manually
docker-compose --profile migrations up migrator

# View logs
docker-compose logs -f api
```

### Production Docker Deployment

```bash
# Build and run migrations
docker-compose up --build
docker-compose --profile migrations up migrator

# Start application
docker-compose up -d api
```

### Environment Variables in Docker

Set these in your `docker-compose.yml` or `.env` file:

```bash
DB_HOST=mysql          # Docker service name
DB_PORT=3306
DB_NAME=CocherasUTN
DBUSER=cocheras_user
DBPASS=cocheras_password
```

## CI/CD Examples

### GitHub Actions

```yaml
name: Deploy

on:
  push:
    branches: [main]

jobs:
  deploy:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v2

      - name: Setup Node.js
        uses: actions/setup-node@v2
        with:
          node-version: '22'

      - name: Install pnpm
        run: npm install -g pnpm

      - name: Install dependencies
        run: pnpm install

      - name: Build
        run: pnpm build

      - name: Run Migrations
        run: pnpm migrate:prod
        env:
          DATABASE_URL: ${{ secrets.DATABASE_URL }}

      - name: Deploy
        run: # Your deployment commands
```

## Summary

1. **Modify entities** in your code
2. **Create migration** to capture changes
3. **Test locally** with `pnpm migration:up`
4. **Commit everything** (entities + migrations)
5. **Deploy** - migrations run automatically
6. **Monitor** - check for any issues

The key insight: **Migrations ensure your code and database stay in sync** across all environments (local, staging, production).
