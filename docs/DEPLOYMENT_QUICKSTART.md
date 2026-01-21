# 🚀 Quick Start: Deploy to Production

Choose your deployment path based on your needs:

## 📍 Path 1: Cloud Platform (Easiest - 5 minutes)

**Best for:** Beginners, quick deployment, managed infrastructure

### Option A: Railway (Recommended)

```bash
# 1. Go to https://railway.app/
# 2. Click "New Project" → "Deploy from GitHub repo"
# 3. Select your DSW-BackEnd repository
# 4. Railway auto-detects everything!

# 5. Set environment variables in Railway dashboard:
DATABASE_URL=mysql://...
JWT_SECRET=your_jwt_secret
NODE_ENV=production
RUN_MIGRATIONS=true

# 6. Click "Deploy" - Done! ✅
```

**Cost:** Free tier available, then $5+/month
**Includes:** Database, SSL, automatic deployments

### Option B: Render

```bash
# 1. Go to https://render.com/
# 2. Click "New" → "Web Service"
# 3. Connect your GitHub repo
# 4. Configure:
#    - Environment: Docker
#    - Environment Variables:
#      DATABASE_URL=mysql://...
#      JWT_SECRET=your_jwt_secret
#      NODE_ENV=production
#      RUN_MIGRATIONS=true
# 5. Click "Deploy Web Service" - Done! ✅
```

**Cost:** Free tier available, then ~$7/month

### Option C: Fly.io

```bash
# 1. Install fly CLI
curl -L https://fly.io/install.sh | sh

# 2. Login
fly auth login

# 3. Launch (auto-detects Dockerfile)
fly launch

# 4. Set secrets
fly secrets set DATABASE_URL=mysql://...
fly secrets set JWT_SECRET=your_jwt_secret
fly secrets set RUN_MIGRATIONS=true

# 5. Deploy
fly deploy
```

**Cost:** Free tier available ~$3-5/month

---

## 📍 Path 2: GitHub Actions + Your Server (Most Control)

**Best for:** Full control, custom domain, existing infrastructure

### Prerequisites
- VPS (DigitalOcean $4/mo, Linode $5/mo, AWS EC2 Free Tier)
- Domain name (optional)

### Step 1: Prepare Your Server

```bash
# SSH into your server
ssh root@your-server-ip

# Install Docker
curl -fsSL https://get.docker.com | sh

# Create app directory
mkdir -p /app
cd /app

# Create .env file
nano .env
```

Add to `.env`:
```bash
DB_HOST=your-db-host  # or use Railway/Render managed DB
DB_PORT=3306
DB_NAME=CocherasUTN
DBUSER=your_db_user
DBPASS=your_db_password
JWT_SECRET=generate_strong_random_secret_here
PORT=3000
NODE_ENV=production
RUN_MIGRATIONS=true
```

### Step 2: Configure GitHub Actions

Go to GitHub repo → Settings → Secrets → Add these:

```
SERVER_HOST=your-server-ip
SERVER_USER=root
SSH_PRIVATE_KEY=[your SSH private key]
DATABASE_URL=mysql://...
```

### Step 3: Deploy

Push to `main` branch and GitHub Actions will:
1. ✅ Run tests
2. ✅ Build Docker image
3. ✅ Push to GitHub Container Registry
4. ✅ SSH into your server
5. ✅ Pull latest image
6. ✅ Restart container

**Automatic!** Every push to main deploys.

---

## 📍 Path 3: Manual Docker Deployment (Simple VPS)

**Best for:** Learning, small projects, manual control

### One-Time Setup

```bash
# 1. Build locally
docker build -t cocheras-backend .

# 2. Test locally
docker run -p 3000:3000 --env-file .env cocheras-backend

# 3. Save image
docker save cocheras-backend | gzip > cocheras-backend.tar.gz

# 4. Copy to server
scp cocheras-backend.tar.gz user@server:/app/
scp .env user@server:/app/

# 5. On server
ssh user@server
docker load < cocheras-backend.tar.gz
docker run -d \
  --name cocheras-api \
  -p 3000:3000 \
  --env-file .env \
  --restart unless-stopped \
  cocheras-backend
```

### Updates

```bash
# Repeat steps 1-4, then on server:
docker stop cocheras-api
docker rm cocheras-api
docker run -d --name cocheras-api ... (same as above)
```

---

## 📍 Path 4: Docker Compose (With Database)

**Best for:** Complete stack deployment, development + production

### docker-compose.yml (already created)

```bash
# 1. Copy to server
scp docker-compose.yml .env user@server:/app/

# 2. SSH and deploy
ssh user@server
cd /app
docker-compose up -d
```

Includes:
- ✅ MySQL database
- ✅ Backend API
- ✅ Automatic migrations
- ✅ Persistent volumes

---

## 🔧 Setting Up the Database

### Option 1: Managed Database (Recommended)

**Railway Database:**
- Create new project in Railway
- Add "Database" service
- Get connection string from dashboard
- Use `DATABASE_URL` environment variable

**Render Database:**
- Similar to Railway
- PostgreSQL or MySQL
- Free tier available

**PlanetScale:**
- Free MySQL database
- Great for production
- Edge caching

### Option 2: Your Own MySQL

```bash
# Install MySQL on server
sudo apt install mysql-server

# Secure installation
sudo mysql_secure_installation

# Create database
sudo mysql -e "CREATE DATABASE CocherasUTN;"
sudo mysql -e "CREATE USER 'cocheras'@'localhost' IDENTIFIED BY 'secure_password';"
sudo mysql -e "GRANT ALL PRIVILEGES ON CocherasUTN.* TO 'cocheras'@'localhost';"
sudo mysql -e "FLUSH PRIVILEGES;"

# Use in .env
DB_HOST=localhost
DBUSER=cocheras
DBPASS=secure_password
DB_NAME=CocherasUTN
```

---

## 🔒 Security Checklist

Before going to production:

- [ ] Change all default passwords
- [ ] Use strong `JWT_SECRET`
- [ ] Enable HTTPS (use Let's Encrypt or cloud platform SSL)
- [ ] Set up CORS correctly (your frontend domain only)
- [ ] Don't commit `.env` file
- [ ] Use environment variables for secrets
- [ ] Regular database backups
- [ ] Monitor logs

---

## 📊 Monitoring

### Add Logging (Optional)

```typescript
// In production-start.ts or app.ts
import morgan from 'morgan';

if (process.env.NODE_ENV === 'production') {
  app.use(morgan('combined')); // HTTP request logging
}
```

### Health Check

Your API has `/health` endpoint:
```bash
curl http://your-domain.com/health
# Returns: {"status":"healthy","timestamp":"..."}
```

### View Logs

```bash
# Docker logs
docker logs -f cocheras-api

# Or with docker-compose
docker-compose logs -f api
```

---

## 🎯 Recommendation

**For your use case, I recommend:**

### Quick Start (5 min):
→ **Railway** or **Render**
- Easiest setup
- Free database included
- SSL certificate included
- Automatic deployments
- Good scaling

### Best Value ($5-10/mo):
→ **DigitalOcean VPS + GitHub Actions**
- Full control
- Learn Docker & DevOps
- Custom domain
- Can host multiple projects

### For Learning:
→ **Manual Docker deployment**
- Understand everything
- Build skills
- Then migrate to GitHub Actions

---

## 📝 Next Steps

1. ✅ Choose your deployment path
2. ✅ Set up database
3. ✅ Configure environment variables
4. ✅ Deploy
5. ✅ Test your API
6. ✅ Connect your Angular frontend

---

## 🆘 Troubleshooting

### Container won't start
```bash
docker logs cocheras-api
# Check for database connection errors, missing env vars
```

### Migration fails
```bash
# Manually run migrations
docker exec cocheras-api node dist/shared/db/run-migrations.js
```

### Database connection refused
- Check `DB_HOST` (use `localhost` if DB on same server)
- Check firewall rules
- Verify database is running

### Can't access API from browser
- Check CORS settings in `app.ts`
- Verify port is open: `sudo ufw allow 3000`
- Check if container is running: `docker ps`

---

## 📚 Additional Resources

- [Docker Documentation](https://docs.docker.com/)
- [GitHub Actions Docs](https://docs.github.com/en/actions)
- [Railway Guide](https://docs.railway.app/)
- [MikroORM Production](https://mikro-orm.io/docs/deployment)

---

Need help? Check:
- `MIGRATIONS.md` - Database migration guide
- `DEPLOYMENT.md` - Docker deployment details
- `MIGRATION_WORKFLOW.md` - How to make schema changes
