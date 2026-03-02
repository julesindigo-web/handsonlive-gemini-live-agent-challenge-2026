#!/bin/bash

# HandsOnLive Deployment Script
# Automates deployment to Google Cloud Run

set -e

echo "🚀 Starting HandsOnLive deployment..."

# Configuration
PROJECT_ID="${GOOGLE_CLOUD_PROJECT:-handsonlive-dev}"
REGION="${REGION:-us-central1}"
BACKEND_SERVICE="handsonlive-backend"
FRONTEND_SERVICE="handsonlive-frontend"

# Colors for output
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
RED='\033[0;31m'
NC='\033[0m' # No Color

# Function to print colored output
print_status() {
  local color=$1
  local message=$2
  echo -e "${color}${message}${NC}"
}

# Check if gcloud is installed
if ! command -v gcloud &> /dev/null; then
  print_status $RED "Error: gcloud CLI not found"
  print_status $YELLOW "Please install Google Cloud SDK: https://cloud.google.com/sdk/docs/install"
  exit 1
fi

# Check if user is authenticated
if ! gcloud auth list --filter="status:ACTIVE" --format="value(account)" | grep -q "@"; then
  print_status $YELLOW "Not authenticated. Running gcloud auth login..."
  gcloud auth login
fi

# Set default project
print_status $GREEN "Setting project to $PROJECT_ID..."
gcloud config set project $PROJECT_ID

# Build and deploy backend
print_status $GREEN "Building backend..."
cd backend
npm ci
npm run build

print_status $GREEN "Deploying backend to Cloud Run..."
gcloud run deploy $BACKEND_SERVICE \
  --source . \
  --region $REGION \
  --platform managed \
  --allow-unauthenticated \
  --set-env-vars="GEMINI_API_KEY=\$GEMINI_API_KEY,GOOGLE_CLOUD_PROJECT=$PROJECT_ID,FIRESTORE_DATABASE=handsonlive" \
  --max-instances=10 \
  --min-instances=1 \
  --memory=512Mi \
  --cpu=1

BACKEND_URL=$(gcloud run services describe $BACKEND_SERVICE --region $REGION --format="value(status.url)")
print_status $GREEN "Backend deployed to: $BACKEND_URL"

cd ..

# Build and deploy frontend
print_status $GREEN "Building frontend..."
cd frontend
npm ci
npm run build

print_status $GREEN "Deploying frontend to Cloud Run..."
gcloud run deploy $FRONTEND_SERVICE \
  --source . \
  --region $REGION \
  --platform managed \
  --allow-unauthenticated \
  --set-env-vars="NEXT_PUBLIC_API_URL=$BACKEND_URL" \
  --max-instances=10 \
  --min-instances=1 \
  --memory=512Mi \
  --cpu=1

FRONTEND_URL=$(gcloud run services describe $FRONTEND_SERVICE --region $REGION --format="value(status.url)")
print_status $GREEN "Frontend deployed to: $FRONTEND_URL"

print_status $GREEN "✅ Deployment complete!"
print_status $YELLOW "Backend URL: $BACKEND_URL"
print_status $YELLOW "Frontend URL: $FRONTEND_URL"
print_status $YELLOW "Health check: curl $BACKEND_URL/health"

# Run health checks
print_status $GREEN "Running health checks..."
sleep 5

BACKEND_HEALTH=$(curl -s -o /dev/null -w "%{http_code}" $BACKEND_URL/health)
FRONTEND_HEALTH=$(curl -s -o /dev/null -w "%{http_code}" $FRONTEND_URL/)

if [ "$BACKEND_HEALTH" = "200" ]; then
  print_status $GREEN "✓ Backend health check passed"
else
  print_status $RED "✗ Backend health check failed (HTTP $BACKEND_HEALTH)"
fi

if [ "$FRONTEND_HEALTH" = "200" ]; then
  print_status $GREEN "✓ Frontend health check passed"
else
  print_status $RED "✗ Frontend health check failed (HTTP $FRONTEND_HEALTH)"
fi

print_status $GREEN "🎉 Deployment successful!"
