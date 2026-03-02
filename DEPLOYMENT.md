# HandsOnLive Deployment Documentation

## Prerequisites

1. Google Cloud SDK installed
2. gcloud CLI authenticated
3. Project configured
4. Environment variables set

## Quick Deploy

```bash
# Set environment variables
export GOOGLE_CLOUD_PROJECT=your-project-id
export REGION=us-central1
export GEMINI_API_KEY=your-gemini-api-key

# Run deployment script
chmod +x deploy.sh
./deploy.sh
```

## Manual Deployment

### Backend Deployment

```bash
cd backend
npm ci
npm run build

gcloud run deploy handsonlive-backend \
  --source . \
  --region us-central1 \
  --platform managed \
  --allow-unauthenticated \
  --set-env-vars="GEMINI_API_KEY=\$GEMINI_API_KEY,GOOGLE_CLOUD_PROJECT=$PROJECT_ID" \
  --max-instances=10 \
  --min-instances=1
```

### Frontend Deployment

```bash
cd frontend
npm ci
npm run build

gcloud run deploy handsonlive-frontend \
  --source . \
  --region us-central1 \
  --platform managed \
  --allow-unauthenticated \
  --set-env-vars="NEXT_PUBLIC_API_URL=$BACKEND_URL" \
  --max-instances=10 \
  --min-instances=1
```

## Environment Variables

### Backend
- `GEMINI_API_KEY`: Required for Gemini API access
- `GOOGLE_CLOUD_PROJECT`: GCP project ID
- `FIRESTORE_DATABASE`: Firestore database name
- `REDIS_HOST`: Redis host (optional)
- `REDIS_PORT`: Redis port (optional)

### Frontend
- `NEXT_PUBLIC_API_URL`: Backend API URL

## Health Checks

```bash
# Backend health
curl https://backend-url/health

# Frontend health
curl https://frontend-url/api/health
```

## Monitoring

```bash
# View logs
gcloud logging read --limit 50 --freshness 1h

# View metrics
gcloud monitoring dashboards list

# View services
gcloud run services list
```

## Rollback

```bash
# Rollback to previous revision
gcloud run services update handsonlive-backend \
  --region us-central1 \
  --revision=previous-revision-id
```

## Scaling

```bash
# Update scaling
gcloud run services update handsonlive-backend \
  --region us-central1 \
  --max-instances=20 \
  --min-instances=2
```

## Cost Optimization

- Use min-instances to reduce cold starts
- Set appropriate memory limits
- Enable request timeout
- Use Cloud Run autoscaling
