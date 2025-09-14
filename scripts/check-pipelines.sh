#!/bin/bash

# AI Email Marketing System - Pipeline Checker Script
# Copyright (c) 2024 Muhammad Ismail
# Email: ismail@aimnovo.com
# Founder: AimNovo.com | AimNexus.ai

# Script to check pipeline status locally using curl

set -e

# Configuration
API_PORT=${API_PORT:-3501}
API_BASE_URL="http://localhost:${API_PORT}/api/v1"

# Colors
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m' # No Color

# Functions
print_header() {
    echo -e "${BLUE}🔍 AI Email Marketing System - Pipeline Checker${NC}"
    echo -e "${BLUE}===============================================${NC}"
    echo
}

check_dependencies() {
    if ! command -v curl &> /dev/null; then
        echo -e "${RED}Error: curl is required but not installed${NC}" >&2
        exit 1
    fi
    
    if ! command -v jq &> /dev/null; then
        echo -e "${YELLOW}Warning: jq is recommended for better output formatting${NC}"
    fi
}

check_api_status() {
    echo -e "${BLUE}Checking if API is running...${NC}"
    
    if curl -s -f "${API_BASE_URL}/health" > /dev/null; then
        echo -e "${GREEN}✅ API is running${NC}"
        return 0
    else
        echo -e "${RED}❌ API is not running${NC}"
        echo -e "${YELLOW}Please start the API server first:${NC}"
        echo -e "${YELLOW}  Run: npm run dev --filter=api${NC}"
        echo -e "${YELLOW}  Or: cd apps/api && npm run dev${NC}"
        return 1
    fi
}

# Generate a simple JWT token for testing (this is a placeholder)
generate_test_token() {
    # In a real scenario, you would need a proper JWT token
    # For now, we'll use a placeholder that might work with the auth bypass in dev
    echo "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VySWQiOiJ0ZXN0LXVzZXItaWQiLCJjb21wYW55SWQiOiJ0ZXN0LWNvbXBhbnktaWQiLCJlbWFpbCI6InRlc3RAZXhhbXBsZS5jb20iLCJpYXQiOjE1MTYyMzkwMjJ9.4S8ca23toT13L9JIXkknC8P2Q1b8jBflVBaRt2Q38Os"
}

# Make API request
make_request() {
    local endpoint=$1
    local token=$(generate_test_token)
    
    if command -v jq &> /dev/null; then
        curl -s -H "Authorization: Bearer ${token}" "${API_BASE_URL}${endpoint}" | jq
    else
        curl -s -H "Authorization: Bearer ${token}" "${API_BASE_URL}${endpoint}"
    fi
}

# Get pipelines
get_pipelines() {
    echo -e "${BLUE}Fetching pipelines...${NC}"
    make_request "/pipelines"
}

# Get pipeline by ID
get_pipeline_by_id() {
    local id=$1
    echo -e "${BLUE}Fetching pipeline ${id}...${NC}"
    make_request "/pipelines/${id}"
}

# Main function
main() {
    print_header
    check_dependencies
    
    if ! check_api_status; then
        exit 1
    fi
    
    echo
    get_pipelines
}

# Run main function
main "$@"