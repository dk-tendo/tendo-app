#!/bin/bash

ENV=$1

# Check if environment is provided
if [ -z "$ENV" ]; then
  echo "No environment was provided."
  echo "Usage: bash $0 <environment>"
  exit 1
fi

CONFIG_TEMPLATE="infra/cloudfront/cf-config.template.json"
CONFIG_FILE="infra/cloudfront/cf-config.$ENV.json"
DIST_MAP="infra/cloudfront/dist-id-map.json"
CALLER_REF="myapp-$ENV-$(date +%s)"

# Check if a distribution already exists
DIST_ID=$(jq -r --arg env "$ENV" '.[$env]' $DIST_MAP)

# Check if the distribution ID exists
if [ "$DIST_ID" != "null" ]; then
  echo "Distribution exists for $ENV: $DIST_ID"
else
  echo "No distribution found for $ENV. Creating new CloudFront distribution..."

  # Replace placeholders in template
  sed "s/__CALLER_REFERENCE__/$CALLER_REF/g; s/__ENV__/$ENV/g" $CONFIG_TEMPLATE > $CONFIG_FILE

  # Create distribution
  DIST_ID=$(aws cloudfront create-distribution \
    --distribution-config file://$CONFIG_FILE \
    --query 'Distribution.Id' \
    --output text)

  if [ $? -eq 0 ]; then
    echo "Created CloudFront distribution $DIST_ID for $ENV"

    # Save it to map file
    jq --arg env "$ENV" --arg id "$DIST_ID" '. + {($env): $id}' $DIST_MAP > tmp.$ENV.json && mv tmp.$ENV.json $DIST_MAP
  else
    echo "Failed to create CloudFront distribution"
    exit 1
  fi
fi
