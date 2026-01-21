# Production Deployment Guide

Complete guide to deploy your backend to production using GitHub Actions.

## Overview

The deployment pipeline consists of:

```
┌──────────────┐
│   Push to    │
 │   main      │
└──────┬───────┘
       │
       ▼
┌──────────────┐
│  1. Test     │  ← Run tests, lint, type check
└──────┬───────┘
       │
       ▼
┌──────────────┐
│  2. Build    │  ← Build Docker image
│   Docker     │  ← Push to GitHub Container Registry
└──────┬───────┘
       │
       ▼
┌──────────────┐
│  3. Migrate  │  ← Run database migrations
└──────┬───────┘
       │
       ▼
┌──────────────┐
│  4. Deploy   │  ← Deploy to production
└──────────────┘
```

## Step 1: Configure GitHub Secrets

Go to your GitHub repository: **Settings → Secrets and variables → Actions → New repository secret**

Add these secrets:

### Required Secrets

| Secret Name | Example Value | Description |
|-------------|---------------|-------------|
| `DATABASE_URL` | `mysql://user:pass@host:port/db` | Full database connection string |
| `DB_HOST` | `your-db-host.com` | Database host |
| `DB_PORT` | `3306` | Database port |
| `DB_NAME` | `CocherasUTN` | Database name |
| `DBUSER` | `db_user` | Database user |
| `DBPASS` | `secure_password` | Database password |

### Optional Secrets (for deployment)

| Secret Name | Description |
|-------------|-------------|
| `SERVER_HOST` | Your server IP/hostname (for SSH deployment) |
| `SERVER_USER` | SSH username |
| `SSH_PRIVATE_KEY` | SSH private key for server access |
| `RAILWAY_DEPLOY_WEBHOOK` | Railway deploy webhook URL |
| `RENDER_DEPLOY_WEBHOOK` | Render deploy webhook URL |

## Step 2: Choose Your Deployment Strategy

### Option A: Cloud Platform (Easiest - Recommended)

#### Railway (railway.app)

1. Go to [railway.app](https://railway.app/)
2. Click "New Project" → "Deploy from GitHub repo"
3. Select your repository
4. Railway will:
   - Detect your Dockerfile
   - Build and deploy automatically
   - Provide a database (or use your own)
   - Set environment variables

**Environment Variables in Railway:**
```
DB_HOST=your-railway-db-host.railway.app
DB_PORT=3306
DB_NAME=railway
DBUSER=root
DBPASS=your_railway_db_password
JWT_SECRET=your_jwt_secret
PORT=3000
NODE_ENV=production
```

**No GitHub Actions needed!** Railway handles everything automatically.

#### Render (render.com)

1. Go to [render.com](https://render.com/)
2. Click "New" → "Web Service"
3. Connect your GitHub repository
4. Configure:
   - **Environment**: Docker
   - **Build Command**: (empty for Docker)
   - **Start Command**: `node dist/app.js`

**Add Environment Variables:**
```
DATABASE_URL=mysql://...
JWT_SECRET=...
NODE_ENV=production
```

#### Other Easy Options

- **Fly.io**: `fly launch` - Auto-detects Dockerfile
- **DigitalOcean App Platform**: Connect repo → Deploy
- **Heroku**: `heroku container:push web --recursive`

### Option B: Your Own Server with Docker

#### Prerequisites
- VPS (DigitalOcean, Linode, AWS EC2, etc.)
- Domain name (optional)
- Docker installed on server

#### Server Setup

1. **SSH into your server:**
```bash
ssh user@your-server-ip
```

2. **Install Docker:**
```bash
curl -fsSL https://get.docker.com -o get-docker.sh
sh get-docker.sh
```

3. **Create .env file:**
```bash
nano /app/.env
```

Add your production environment variables:
```bash
DB_HOST=your-db-host
DB_PORT=3306
DB_NAME=CocherasUTN
DBUSER=your_db_user
DBPASS=your_db_password
JWT_SECRET=your_jwt_secret
PORT=3000
NODE_ENV=production
```

4. **Deploy manually (first time):**
```bash
# Login to GitHub Container Registry
echo $GITHUB_TOKEN | docker login ghcr.io -u USERNAME --password-stdin

# Pull the image
docker pull ghcr.io/yourusername/DSW-BackEnd:latest

# Run migrations
docker run --rm --env-file /app/.env \
  ghcr.io/yourusername/DSW-BackEnd:latest \
  node dist/shared/db/run-migrations.js

# Start the application
docker run -d \
  --name cocheras-api \
  -p 3000:3000 \
  --env-file /app/.env \
  --restart unless-stopped \
  ghcr.io/yourusername/DSW-BackEnd:latest
```

5. **Set up auto-deployment with GitHub Actions:**

Update `.github/workflows/ci-cd.yml`:
```yaml
# In the "deploy" job, uncomment and configure:

- name: Deploy to server via SSH
  uses: appleboy/ssh-action@v1.0.0
  with:
    host: ${{ secrets.SERVER_HOST }}
    username: ${{ secrets.SERVER_USER }}
    key: ${{ secrets.SSH_PRIVATE_KEY }}
    script: |
      cd /app
      docker pull ghcr.io/${{ github.repository }}:latest
      docker stop cocheras-api || true
      docker rm cocheras-api || true
      docker run -d --name cocheras-api \
        -p 3000:3000 \
        --env-file .env \
        --restart unless-stopped \
        ghcr.io/${{ github.repository }}:latest
```

### Option C: Docker Compose on Server

1. **Copy docker-compose.yml to server:**
```bash
scp docker-compose.yml user@server:/app/
```

2. **SSH into server and deploy:**
```bash
ssh user@server
cd /app
docker-compose pull
docker-compose --profile migrations up migrator
docker-compose up -d
```

3. **Or use GitHub Actions:**
```yaml
- name: Deploy via Docker Compose
  uses: appleboy/ssh-action@v1.0.0
  with:
    host: ${{ secrets.SERVER_HOST }}
    username: ${{ secrets.SERVER_USER }}
    key: ${{ secrets.SSH_PRIVATE_KEY }}
    script: |
      cd /app
      docker-compose pull
      docker-compose --profile migrations up migrator
      docker-compose up -d
```

## Step 3: Add Health Check Endpoint

Your Dockerfile references a `/health` endpoint. Add it to your app:<tool_call>Read<arg_key>file_path</arg_key><arg_value>/Users/manu/repos/DSW-BackEnd/src/app.ts