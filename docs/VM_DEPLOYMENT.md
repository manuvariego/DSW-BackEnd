# VM Deployment Guide (Docker Compose)

Deploy using a single VM with Docker Compose. MySQL runs in a container alongside your API.

---

## Prerequisites

- Google Cloud Project
- A VM (Compute Engine) with Docker installed

---

## Step 1: Create a VM

```bash
# Create VM with Docker pre-installed
gcloud compute instances create cocheras-vm \
  --zone=us-central1-a \
  --machine-type=e2-medium \
  --image-family=ubuntu-2204-lts \
  --image-project=ubuntu-os-cloud-cloud \
  --boot-disk-size=30GB \
  --tags=http-server,https-server \
  --metadata=startup-script='
    #!/bin/bash
    curl -fsSL https://get.docker.com -o get-docker.sh
    sh get-docker.sh
    usermod -aG docker ubuntu
    apt-get update && apt-get install -y git
  '

# Add firewall rule for port 3000
gcloud compute firewall-rules create allow-cocheras-api \
  --allow tcp:3000 \
  --source-ranges 0.0.0.0/0 \
  --description "Allow API access"
```

**Cost: e2-medium ≈ $24/month**

---

## Step 2: SSH into the VM

```bash
# Generate SSH key if you don't have one
ssh-keygen -t rsa -b 4096 -C "your-email@example.com"

# Add your public key to the VM
gcloud compute config-ssh --project=YOUR_PROJECT_ID

# Or SSH directly
gcloud compute ssh cocheras-vm --zone=us-central1-a
```

---

## Step 3: Setup on the VM

```bash
# Clone your repo
git clone https://github.com/YOUR_USERNAME/DSW-BackEnd.git ~/cocheras
cd ~/cocheras

# Create .env file
cp .env.example .env
nano .env  # Edit with your values
```

**Example `.env` for VM:**
```env
NODE_ENV=production
PORT=3000
DB_NAME=CocherasUTN
DB_HOST=mysql  # Container name in docker-compose
DB_PORT=3306
DBUSER=cocheras_user
DBPASS=your_secure_password
JWT_SECRET=your_jwt_secret_here
CORS_ORIGIN=*
DB_ROOT_PASSWORD=root_password_here
```

---

## Step 4: Start with Docker Compose

```bash
# Build and start all services
docker-compose -f docker-compose.prod.yml --profile local up -d

# Run migrations
docker-compose -f docker-compose.prod.yml exec api node dist/shared/db/migration-runner.js

# Check logs
docker-compose -f docker-compose.prod.yml logs -f

# Check status
docker-compose -f docker-compose.prod.yml ps
```

---

## Step 5: Get External IP

```bash
gcloud compute instances describe cocheras-vm \
  --zone=us-central1-a \
  --format='get(networkInterfaces[0].accessConfigs[0].natIP)'
```

Your API will be available at: `http://YOUR_VM_IP:3000`

---

## Step 6: Setup GitHub Actions (Optional)

Add these secrets to GitHub: **Settings → Secrets and variables → Actions**

| Secret | Value |
|--------|-------|
| `VM_IP` | Your VM's external IP |
| `SSH_USER` | `ubuntu` or your username |
| `SSH_PRIVATE_KEY` | Output of `cat ~/.ssh/id_rsa` |

Then push to master to auto-deploy.

---

## Updating the App

### Manual
```bash
ssh into vm
cd ~/cocheras
git pull
docker-compose -f docker-compose.prod.yml build
docker-compose -f docker-compose.prod.yml up -d
```

### Automatic (via GitHub Actions)
Just push to master - the workflow handles everything.

---

## Useful Commands

```bash
# View logs
docker-compose -f docker-compose.prod.yml logs api

# Restart services
docker-compose -f docker-compose.prod.yml restart

# Stop everything
docker-compose -f docker-compose.prod.yml down

# Access MySQL directly
docker-compose -f docker-compose.prod.yml exec mysql mysql -u cocheras_user -p

# Backup database
docker-compose -f docker-compose.prod.yml exec mysql mysqldump -u root -p CocherasUTN > backup.sql

# Restore database
docker-compose -f docker-compose.prod.yml exec -T mysql mysql -u root -p CocherasUTN < backup.sql
```

---

## Cost Summary (Monthly)

| Service | Cost |
|---------|------|
| Compute Engine (e2-medium) | ~$24 |
| Storage (30GB) | Included |
| **Total** | **~$24/month** |

(vs ~$40-100/month with Cloud SQL + Cloud Run)
