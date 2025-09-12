#!/bin/bash

# Script to fix common lint errors
# Replace unused variables with underscore prefix

# API lint fixes
files=(
  "apps/api/src/emails/emails.service.spec.ts"
  "apps/api/src/leads/leads.service.spec.ts"
  "apps/api/src/pipelines/pipelines.service.spec.ts"
  "apps/api/src/users/users.service.spec.ts"
  "apps/api/test/integration/email-marketing-workflow.integration.spec.ts"
)

for file in "${files[@]}"; do
  if [ -f "$file" ]; then
    # Replace databaseService with _databaseService
    sed -i '' 's/databaseService = module\.get/_databaseService = module.get/g' "$file"
    # Replace configService with _configService  
    sed -i '' 's/configService = module\.get/_configService = module.get/g' "$file"
    # Replace pipelineQueue with _pipelineQueue
    sed -i '' 's/pipelineQueue = module\.get/_pipelineQueue = module.get/g' "$file"
    echo "Fixed $file"
  fi
done

echo "Lint fixes complete!"