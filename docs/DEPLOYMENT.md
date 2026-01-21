# Quick Reference: Docker Deployment with Migrations

## Docker Build Process

```
┌─────────────────────────────────────────────────────────────┐
│                    DOCKER IMAGE BUILD                       │
├─────────────────────────────────────────────────────────────┤
│                                                             │
│  1. BUILD STAGE (builder)                                   │
│     ├── Install dependencies (pnpm install)                 │
│     ├── Compile TypeScript (tsc)                           │
│     └── Output: dist/ directory                            │
│                                                             │
│  2. PRODUCTION STAGE (production)                           │
│     ├── Copy: dist/ from builder                           │
│     ├── Copy: migrations/ from builder                      │
│     ├── Install production deps only                        │
│     └── Create non-root user                               │
│                                                             │
└─────────────────────────────────────────────────────────────┘
```

## Deployment Options

### Option 1: Single Container (Migrations in App Code)

**Dockerfile:** Runs app only (migrations must be in app startup)

```typescript
// src/app.ts
import { runMigrations } from './shared/db/migrate.js';

await runMigrations(); // ← Run migrations on startup

app.listen(port, () => {
  console.log('Server running...');
});
```

**Deploy:**
```bash
docker build -t myapp .
docker run -p 3000:3000 --env-file .env myapp
```

### Option 2: Docker Compose (Separate Migration Step)

**docker-compose.yml** (provided)
```bash
# Run migrations first
docker-compose --profile migrations up migrator

# Then start app
docker-compose up -d api
```

### Option 3: Multi-Stage Build with Entrypoint Script

**Dockerfile with entrypoint:**
```dockerfile
# ... build stages ...

# Add entrypoint script
COPY docker-entrypoint.sh /entrypoint.sh
RUN chmod +x /entrypoint.sh

ENTRYPOINT ["/entrypoint.sh"]
CMD ["node", "dist/app.js"]
```

**docker-entrypoint.sh:**
```bash
#!/bin/sh
set -e

echo "Running migrations..."
node dist/shared/db/run-migrations.js

echo "Starting application..."
exec "$@"
```

## Environment Variables for Docker

### Required Variables
```bash
# Database
DB_HOST=mysql              # Service name in docker-compose
DB_PORT=3306
DB_NAME=CocherasUTN
DBUSER=cocheras_user
DBPASS=cocheras_password

# Application
NODE_ENV=production
PORT=3000
JWT_SECRET=your_secret_here

# Alternative: Single connection string
DATABASE_URL=mysql://user:pass@host:port/db
```

### Example .env for Docker
```bash
# .env.docker
DB_HOST=mysql
DB_PORT=3306
DB_NAME=CocherasUTN
DBUSER=cocheras_user
DBPASS=secure_password_here
JWT_SECRET=jwt_secret_change_this
PORT=3000
NODE_ENV=production
```

## Common Docker Commands

### Development
```bash
# Start database only
docker-compose up mysql

# Start everything
docker-compose up

# Rebuild and start
docker-compose up --build

# View logs
docker-compose logs -f api

# Stop everything
docker-compose down

# Stop and remove volumes (deletes data!)
docker-compose down -v
```

### Production
```bash
# Build image
docker build -t cocheras-backend:latest .

# Run container
docker run -d \
  --name cocheras-api \
  -p 3000:3000 \
  --env-file .env.production \
  cocheras-backend:latest

# Run migrations first
docker run --rm \
  --env-file .env.production \
  cocheras-backend:latest \
  node dist/shared/db/run-migrations.js

# Check logs
docker logs -f cocheras-api

# Stop container
docker stop cocheras-api
docker rm cocheras-api
```

## Migration Workflow in Docker

```
┌──────────────────┐
│  Make Entity     │
│  Changes         │
└────────┬─────────┘
         │
         ▼
┌──────────────────┐
│  Create          │
│  Migration       │
└────────┬─────────┘
         │
         ▼
┌──────────────────┐
│  Commit to Git   │
└────────┬─────────┘
         │
         ▼
┌──────────────────┐
│  Docker Build    │
│  (New Image)     │
└────────┬─────────┘
         │
         ▼
┌──────────────────┐
│  Push to Reg.    │
│  (Docker Hub)    │
└────────┬─────────┘
         │
         ▼
┌──────────────────┐
│  Deploy          │
│  - Pull Image    │
│  - Run Migrations│
│  - Start App     │
└──────────────────┘
```

## Quick Start Guide

### Local Development with Docker

```bash
# 1. Start database
docker-compose up mysql -d

# 2. Wait for database to be ready
docker-compose logs mysql

# 3. Run migrations (local)
pnpm migration:up

# 4. Start app locally
pnpm start:dev

# OR start everything with Docker
docker-compose up
```

### Production Deployment

```bash
# 1. Set environment variables
cp .env.example .env.production
# Edit .env.production with production values

# 2. Build and run migrations
docker-compose --env-file .env.production up --build
docker-compose --env-file .env.production --profile migrations up migrator

# 3. Start application
docker-compose --env-file .env.production up -d api
```

## Troubleshooting

### Container Can't Connect to Database

**Problem:** API container fails to start with database connection error

**Solutions:**
```bash
# Check if database is running
docker-compose ps

# Check database logs
docker-compose logs mysql

# Wait for database to be healthy
docker-compose up mysql
# Wait until you see "ready for connections"
docker-compose up api
```

### Migrations Fail

**Problem:** Migration container exits with error

**Debug:**
```bash
# Run migrator with logs
docker-compose --profile migrations up migrator

# Check migration status inside container
docker-compose exec api node dist/shared/db/run-migrations.js

# Manually inspect database
docker-compose exec mysql mysql -u cocheras_user -pcocheras_password CocherasUTN
```

### Need to Reset Everything

```bash
# Stop and remove all containers and volumes
docker-compose down -v

# Restart from scratch
docker-compose up --build
```

## Health Checks

The Dockerfile includes a health check. Monitor it:

```bash
# Check health status
docker ps
# Look for (healthy) or (unhealthy) status

# Inspect health
docker inspect cocheras_api | grep -A 10 Health
```

## Performance Tips

### 1. Use Build Cache
```bash
# Better: Copy package files first for caching
COPY package.json pnpm-lock.yaml ./
RUN pnpm install --frozen-lockfile
COPY . .
RUN pnpm build
```

### 2. Smaller Production Image
```bash
# Only install production dependencies
RUN pnpm install --prod --frozen-lockfile

# Don't include dev tools
```

### 3. Multi-stage Build
Already implemented! Build stage creates final artifacts, production stage only copies what's needed.

## Security Best Practices

### 1. Non-root User
✅ Already implemented in Dockerfile
```dockerfile
RUN addgroup -g 1001 -S nodejs
RUN adduser -S nodejs -u 1001
USER nodejs
```

### 2. Secrets Management
❌ Don't:
```dockerfile
ENV DBPASS=password  # ← Don't hardcode secrets!
```

✅ Do:
```bash
docker run --env-file .env myapp
# Or use Docker secrets
```

### 3. Minimal Base Image
✅ Using `node:22-alpine` - smaller attack surface

### 4. Read-only Filesystem
```dockerfile
# Add to Dockerfile for extra security
RUN chown -R nodejs:nodejs /app
USER nodejs
READONLY root filesystem
```

## Summary

1. **Development:** Use `docker-compose up` for local development
2. **Migrations:** Run separately with `--profile migrations` before starting app
3. **Production:** Build image, run migrations, then start app
4. **Environment:** Use `.env` files, never hardcode secrets
5. **Monitoring:** Check health status and logs regularly
