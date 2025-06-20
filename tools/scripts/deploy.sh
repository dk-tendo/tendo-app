#!/bin/bash

FRONTEND_ONLY=${1:-false}
API_ONLY=${2:-false}

echo "🚀 Starting complete full-stack deployment to PRODUCTION environment..."
echo "Frontend Only: $FRONTEND_ONLY | API Only: $API_ONLY"

# Color codes for better output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m' # No Color

# Configuration
FRONTEND_PROJECT="frontend"
S3_BUCKET="daniel-tendo-app-1"
DIST_DIR="dist/apps/$FRONTEND_PROJECT"
DIST_MAP="infra/cloudfront/dist-id-map.json"

# Function to print colored output
print_status() {
    echo -e "${GREEN}✅ $1${NC}"
}

print_error() {
    echo -e "${RED}❌ $1${NC}"
}

print_warning() {
    echo -e "${YELLOW}⚠️  $1${NC}"
}

print_info() {
    echo -e "${BLUE}ℹ️  $1${NC}"
}

check_prerequisites() {
    echo ""
    echo "🔍 Checking prerequisites..."

    # Check if NX is available
    if ! command -v nx &> /dev/null; then
        print_error "NX CLI not found. Please install it: npm install -g nx"
        exit 1
    fi

    # Check if Serverless is available (only if deploying API)
    if [ "$FRONTEND_ONLY" != "true" ]; then
        if ! command -v serverless &> /dev/null; then
            print_error "Serverless Framework not found. Please install it: npm install -g serverless"
            exit 1
        fi
    fi

    # Check if AWS CLI is available
    if ! command -v aws &> /dev/null; then
        print_error "AWS CLI not found. Please install it"
        exit 1
    fi

    # Check jq for JSON parsing (needed for CloudFront distribution ID)
    if [ "$API_ONLY" != "true" ]; then
        if ! command -v jq &> /dev/null; then
            print_error "jq not found. Please install it: brew install jq (macOS) or apt-get install jq (Ubuntu)"
            exit 1
        fi
    fi

    # Check AWS credentials
    aws sts get-caller-identity > /dev/null 2>&1
    if [ $? -eq 0 ]; then
        print_status "AWS credentials are valid"
    else
        print_error "AWS credentials not configured. Please run: aws configure"
        exit 1
    fi

    print_status "All prerequisites satisfied"
}

# Function to build and deploy API
deploy_api() {
    echo ""
    echo "🖥️  Deploying API with built-in esbuild..."

    # Load environment variables
    load_environment_variables

    # Validate required environment variables
    validate_environment_variables

    # Deploy with Serverless Framework
    echo ""
    echo "🚀 Deploying API to AWS with Serverless Framework..."
    echo "Note: Built-in esbuild will compile and bundle all dependencies automatically"

    if serverless deploy --stage prod; then
        print_status "API deployment successful!"

        # Return the API endpoint for frontend use
        API_ENDPOINT=$(serverless info --stage prod | grep ServiceEndpoint | awk '{print $2}')

        if [ -n "$API_ENDPOINT" ]; then
            print_info "API Endpoint: $API_ENDPOINT"
            echo "$API_ENDPOINT"
        else
            print_warning "Could not extract API endpoint"
            echo ""
        fi

    else
        print_error "API deployment failed!"
        exit 1
    fi
}

# Function to load environment variables
load_environment_variables() {
    echo ""
    echo "🔧 Loading environment variables for prod..."

    if [ -f ".env.production" ]; then
      export $(grep -v '^#' .env.production | grep -v '^$' | xargs)
      print_status "Production environment loaded"
    else
      print_error ".env.production file not found"
      echo "Please create .env.production with your AWS RDS credentials"
      exit 1
    fi
}

# Function to validate environment variables
validate_environment_variables() {
    echo ""
    echo "🔍 Validating environment variables..."

    required_vars=("DB_HOST" "DB_USERNAME" "DB_PASSWORD" "DB_NAME")

    for var in "${required_vars[@]}"; do
        if [ -z "${!var}" ]; then
            print_error "Required environment variable $var is not set"
            exit 1
        fi
    done

    print_status "All required environment variables are set"
}

# Function to build and deploy frontend
deploy_frontend() {
    echo ""
    echo "🌐 Building and deploying frontend..."

    # Get API endpoint (either from previous deployment or existing deployment)
    if [ -z "$API_ENDPOINT" ]; then
        API_ENDPOINT=$(serverless info --stage prod 2>/dev/null | grep ServiceEndpoint | awk '{print $2}')
    fi

    if [ -z "$API_ENDPOINT" ]; then
        print_warning "Could not get API endpoint. Frontend will use placeholder URL."
        API_ENDPOINT="https://placeholder-api.execute-api.us-east-1.amazonaws.com/dev"
    else
        print_info "Using API endpoint: $API_ENDPOINT"
    fi

    # Check if CloudFront distribution map exists
    if [ ! -f "$DIST_MAP" ]; then
        print_warning "Distribution map not found: $DIST_MAP"
        print_info "Deploying frontend to S3 without CloudFront invalidation"
        DIST_ID=""
    else
        DIST_ID=$(jq -r --arg env "prod" '.[$env]' $DIST_MAP 2>/dev/null)

        if [ "$DIST_ID" = "null" ] || [ -z "$DIST_ID" ]; then
            print_warning "No CloudFront distribution found for prod in $DIST_MAP"
            print_info "Deploying frontend to S3 without CloudFront invalidation"
            DIST_ID=""
        else
            print_info "Using CloudFront distribution: $DIST_ID"
        fi
    fi

    # Create temporary environment file for build
    cat > apps/frontend/.env.local << EOF
VITE_API_URL=$API_ENDPOINT
VITE_ENV=prod
EOF
    print_status "Environment variables set for frontend build"

    # Build frontend
    echo "Building frontend..."
    if nx build $FRONTEND_PROJECT --configuration=production; then
        print_status "Frontend built successfully (production mode)"
    else
        print_error "Frontend build failed"
        exit 1
    fi

    # Verify build output
    if [ ! -d "$DIST_DIR" ]; then
        print_error "Build output directory not found: $DIST_DIR"
        exit 1
    fi

    print_status "Frontend build output verified"

    # Sync to S3
    echo "Syncing frontend to S3..."
    if aws s3 sync $DIST_DIR s3://$S3_BUCKET --delete; then
        print_status "Frontend synced to S3 successfully"
    else
        print_error "Failed to sync frontend to S3"
        exit 1
    fi

    # Invalidate CloudFront cache (only if distribution ID exists)
    if [ -n "$DIST_ID" ]; then
        echo "Creating CloudFront invalidation..."
        INVALIDATION_ID=$(aws cloudfront create-invalidation --distribution-id $DIST_ID --paths "/*" --query 'Invalidation.Id' --output text)

        if [ $? -eq 0 ]; then
            print_status "CloudFront invalidation created: $INVALIDATION_ID"
        else
            print_error "Failed to create CloudFront invalidation"
            exit 1
        fi
    else
        print_info "Skipping CloudFront invalidation (no distribution configured)"
    fi

    # Clean up temporary env file
    rm -f apps/frontend/.env.local

    print_status "Frontend deployment completed successfully"
}

# Function to display deployment summary
show_deployment_summary() {
    echo ""
    echo "🎉 Deployment Summary"
    echo "===================="

    if [ "$API_ONLY" != "true" ] && [ -n "$API_ENDPOINT" ]; then
        echo ""
        echo "🖥️  API Deployment:"
        echo "   Stage: PRODUCTION"
        echo "   Endpoint: $API_ENDPOINT"
        echo "   Build Method: Built-in esbuild (automatic bundling)"
    fi

    if [ "$FRONTEND_ONLY" != "true" ]; then
        echo ""
        echo "🌐 Frontend Deployment:"
        echo "   Stage: PRODUCTION"
        if [ -n "$DIST_ID" ]; then
            echo "   CloudFront URL: https://drh3lhlsbyvln.cloudfront.net"
            echo "   Distribution ID: $DIST_ID"
        fi
        echo "   S3 Bucket: $S3_BUCKET"
        echo "   S3 URL: https://$S3_BUCKET.s3.amazonaws.com/index.html"
    fi

    echo ""
    echo "✅ All deployments completed successfully!"
}

# Main execution flow
main() {
    print_status "Deploying to PRODUCTION"

    check_prerequisites

    # Deploy API (unless frontend-only)
    if [ "$FRONTEND_ONLY" != "true" ]; then
        API_ENDPOINT=$(deploy_api)
    fi

    # Deploy frontend (unless API-only)
    if [ "$API_ONLY" != "true" ]; then
        deploy_frontend
    fi

    # Show summary
    show_deployment_summary
}

# Parse command line arguments
case "$1" in
    "--help"|"-h")
        echo "Usage: $0 [stage] [frontend-only] [api-only]"
        echo ""
        echo "Arguments:"
        echo "  frontend-only Deploy only frontend (true|false) [default: false]"
        echo "  api-only     Deploy only API (true|false) [default: false]"
        echo ""
        echo "Examples:"
        echo "  $0 true false      # Deploy only frontend"
        echo "  $0 false true      # Deploy only API"
        exit 0
        ;;
esac

# Run main function
main