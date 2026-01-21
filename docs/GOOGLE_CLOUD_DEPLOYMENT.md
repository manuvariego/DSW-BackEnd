# Google Cloud Deployment Guide

This guide walks you through deploying the DSW Backend to Google Cloud Platform using Cloud Run, Cloud SQL, and GitHub Actions.

---

## Architecture Overview

```
                    ┌─────────────────┐
                    │  GitHub Actions │
                    │     (CI/CD)     │
                    └────────┬────────┘
                             │
                             ▼
                    ┌─────────────────┐
                    │ Artifact        │
                    │ Registry        │
                    │ (Docker Images) │
                    └────────┬────────┘
                             │
                             ▼
                    ┌─────────────────┐
                    │   Cloud Run     │◄────── Cloud SQL Proxy
                    │   (API Container)│      (for migrations)
                    └────────┬────────┘
                             │
                             ▼
                    ┌─────────────────┐
                    │    Cloud SQL    │
                    │   (MySQL 8.0)   │
                    └─────────────────┘
```

---

## Prerequisites

1. **Google Cloud Project** with billing enabled
2. **gcloud CLI** installed locally
3. **GitHub Repository** with the code

---

## Step 1: Set Up Google Cloud Resources

### 1.1 Set Default Project

```bash
gcloud config set project YOUR_PROJECT_ID
```

### 1.2 Enable Required APIs

```bash
gcloud services enable \
  cloudbuild.googleapis.com \
  run.googleapis.com \
  sqladmin.googleapis.com \
  artifactregistry.googleapis.com \
  iam.googleapis.com
```

### 1.3 Create Artifact Registry (for Docker images)

```bash
gcloud artifacts repositories create containers \
  --repository-format=docker \
  --location=us \
  --description="Docker repository"
```

### 1.4 Create Cloud SQL Instance (MySQL)

```bash
# Create the instance
gcloud sql instances create cocheras-db \
  --database-version=MYSQL_8_0 \
  --tier=db-f1-micro \
  --region=us-central1 \
  --storage-auto-increase \
  --storage-size=10GB

# Set root password
gcloud sql users set-root-password cocheras-db \
  --password=YOUR_SECURE_PASSWORD

# Create the database
gcloud sql databases create CocherasUTN \
  --instance=cocheras-db

# Create a dedicated user (recommended)
gcloud sql users create cocheras_user \
  --instance=cocheras-db \
  --password=YOUR_USER_PASSWORD

# Grant permissions
gcloud sql databases patch CocherasUTN \
  --instance=cocheras-db \
  --account=cocheras_user
```

### 1.5 Configure Cloud SQL Connection

```bash
# Get the connection name
gcloud sql instances describe cocheras-db \
  --format='value(connectionName)'

# Output: YOUR_PROJECT_ID:us-central1:cocheras-db
```

---

## Step 2: Set Up GitHub Actions Authentication

### 2.1 Create a Service Account

```bash
# Create service account
gcloud iam service-accounts create github-actions-deployer \
  --display-name="GitHub Actions Deployer" \
  --project=YOUR_PROJECT_ID
```

### 2.2 Grant Permissions

```bash
# Cloud Run deployer
gcloud projects add-iam-policy-binding YOUR_PROJECT_ID \
  --member="serviceAccount:github-actions-deployer@YOUR_PROJECT_ID.iam.gserviceaccount.com" \
  --role="roles/run.developer"

# Cloud SQL client
gcloud projects add-iam-policy-binding YOUR_PROJECT_ID \
  --member="serviceAccount:github-actions-deployer@YOUR_PROJECT_ID.iam.gserviceaccount.com" \
  --role="roles/cloudsql.client"

# Artifact Registry reader
gcloud projects add-iam-policy-binding YOUR_PROJECT_ID \
  --member="serviceAccount:github-actions-deployer@YOUR_PROJECT_ID.iam.gserviceaccount.com" \
  --role="roles/artifactregistry.reader"

# Service Account User (to impersonate)
gcloud iam service-accounts add-iam-policy-binding \
  github-actions-deployer@YOUR_PROJECT_ID.iam.gserviceaccount.com \
  --member="principalSet://iam.googleapis.com/projects/YOUR_PROJECT_ID/locations/global/workloadIdentityPools/github-actions-pool/providers/github-actions-provider/*" \
  --role="roles/iam.workloadIdentityUser"
```

### 2.3 Configure Workload Identity Federation

```bash
# Create the workload identity pool
gcloud iam workload-identity-pools create github-actions-pool \
  --location="global" \
  --display-name="GitHub Actions Pool"

# Create the provider
gcloud iam workload-identity-pools providers create github-actions-provider \
  --location="global" \
  --workload-identity-pool="github-actions-pool" \
  --display-name="GitHub Actions Provider" \
  --attribute-mapping="google.subject=assertion.sub,attribute.actor=assertion.actor,attribute.repository=assertion.repository"

# Get the provider resource name
gcloud iam workload-identity-pools providers describe github-actions-provider \
  --location="global" \
  --workload-identity-pool="github-actions-pool" \
  --format="value(name)")
```

### 2.4 Add GitHub Secrets

Go to your GitHub repository → Settings → Secrets and Variables → Actions, and add:

| Secret Name | Value |
|-------------|-------|
| `GCP_WORKLOAD_IDENTITY_PROVIDER` | `projects/YOUR_PROJECT_NUMBER/locations/global/workloadIdentityPools/github-actions-pool/providers/github-actions-provider` |
| `GCP_SERVICE_ACCOUNT_EMAIL` | `github-actions-deployer@YOUR_PROJECT_ID.iam.gserviceaccount.com` |
| `DB_NAME` | `CocherasUTN` |
| `DBUSER` | `cocheras_user` |
| `DBPASS` | `Your database password` |
| `JWT_SECRET` | `Your JWT secret` |
| `CORS_ORIGIN` | `https://your-frontend-domain.com` |

---

## Step 3: Configure the Workflow

### 3.1 Update Workflow File

Edit `.github/workflows/deploy-gcp.yml` and update these values:

```yaml
env:
  PROJECT_ID: your-gcp-project-id        # CHANGE THIS
  REGION: us-central1                    # CHANGE THIS if needed
  GAR_LOCATION: us
  IMAGE_NAME: cocheras-api
  CLOUD_RUN_SERVICE: cocheras-api
  CLOUD_SQL_INSTANCE: cocheras-db        # CHANGE THIS
```

---

## Step 4: Deploy

### Option A: Push to Master (Automatic)

```bash
git checkout master
git merge your-feature-branch
git push origin master
```

The workflow will automatically:
1. Build the Docker image
2. Push to Artifact Registry
3. Run database migrations
4. Deploy to Cloud Run

### Option B: Manual Trigger

1. Go to GitHub Actions tab
2. Select "Deploy to Google Cloud"
3. Click "Run workflow"
4. Choose environment (production/staging)

---

## Step 5: Verify Deployment

```bash
# List Cloud Run services
gcloud run services list

# Get service URL
gcloud run services describe cocheras-api \
  --region=us-central1 \
  --format='value(status.url)'

# Test health endpoint
curl https://your-service-url/health
```

---

## Step 6: Configure Cloud SQL Secret (Optional)

For better security, store the database password in Secret Manager:

```bash
# Create secret
echo "your-db-password" | \
  gcloud secrets create cocheras-db-password --data-file=-

# Grant Cloud SQL access
gcloud secrets add-iam-policy-binding cocheras-db-password \
  --member="serviceAccount:YOUR_PROJECT_NUMBER-compute@developer.gserviceaccount.com" \
  --role="roles/secretmanager.secretAccessor"
```

Then in your workflow, reference the secret:
```yaml
secrets: |
  DB_PASS=cocheras-db-password:latest
```

---

## Local Development with Cloud SQL

```bash
# Install Cloud SQL Proxy
brew install cloud-sql-proxy  # macOS
# or download from https://cloud.google.com/sql/docs/mysql/sql-proxy

# Start proxy
cloud-sql-proxy YOUR_PROJECT_ID:us-central1:cocheras-db

# In another terminal, run the app
DB_HOST=127.0.0.1 pnpm start
```

---

## Troubleshooting

### Permission Denied

```bash
# Verify service account permissions
gcloud projects get-iam-policy YOUR_PROJECT_ID \
  --filter="serviceAccount:github-actions-deployer@YOUR_PROJECT_ID.iam.gserviceaccount.com"
```

### Migration Fails

Check Cloud SQL logs:
```bash
gcloud sql logs tail cocheras-db --format=table
```

### Cloud Run Deployment Fails

Check build logs:
```bash
gcloud run services describe cocheras-api \
  --region=us-central1 \
  --format="yaml(status.latestReadyRevisionName)"
```

---

## Cost Estimation (Monthly)

| Service | Tier | Cost |
|---------|------|------|
| Cloud Run | ~1M requests | ~$0-15 |
| Cloud SQL | db-f1-micro | ~$10-15 |
| Artifact Registry | Storage | ~$0.10/GB |

**Estimated total: ~$25-40/month**

---

## Security Checklist

- [ ] Workload Identity Federation configured
- [ ] Secrets stored in GitHub Secrets (not committed)
- [ ] Database password is strong
- [ ] JWT_SECRET is randomized
- [ ] Cloud SQL only allows private IP or authorized connections
- [ ] Cloud Run invocations are authenticated (optional)
- [ ] CORS_ORIGIN is set to your frontend domain only
