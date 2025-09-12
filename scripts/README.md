# Pipeline Checking Scripts

This directory contains scripts to check the status of email marketing pipelines locally.

## Available Scripts

### Node.js Script

```bash
npm run check:pipelines
```

This script provides a detailed view of all pipelines and their executions.

### Bash Script

```bash
npm run check:pipelines:shell
```

This script uses curl to make API requests and display pipeline information.

## Prerequisites

1. The API server must be running locally:

   ```bash
   npm run dev --filter=api
   # or
   cd apps/api && npm run dev
   ```

2. For the Node.js script, you may need to install additional dependencies:

   ```bash
   npm install dotenv jsonwebtoken
   ```

3. For the bash script, you should have `curl` installed (usually available by default on most systems).

## Usage

### Starting the API Server

Before running any pipeline checking scripts, make sure the API server is running:

```bash
# From the root directory
npm run dev --filter=api

# Or from the api directory
cd apps/api
npm run dev
```

### Running the Node.js Script

```bash
npm run check:pipelines
```

This will:

1. Check if the API is running
2. Fetch all pipelines
3. Display pipeline information including:
   - Pipeline name and ID
   - Description
   - Status (active/inactive)
   - Number of steps
   - Creation and update timestamps
   - Recent executions (if any)

### Running the Bash Script

```bash
npm run check:pipelines:shell
```

This will:

1. Check if the API is running
2. Fetch all pipelines using curl
3. Display the raw JSON response (formatted with jq if available)

## Script Details

### check-pipelines.js

A Node.js script that:

- Generates a test JWT token for authentication
- Makes HTTP requests to the API endpoints
- Formats and displays pipeline information in a readable way
- Handles errors gracefully

### check-pipelines.sh

A bash script that:

- Uses curl to make HTTP requests
- Works without additional Node.js dependencies
- Displays raw JSON data (formatted with jq if available)

## Troubleshooting

### API Not Running

If you get an error that the API is not running:

1. Make sure you've started the API server with `npm run dev --filter=api`
2. Check that the API is running on the correct port (default: 3001)
3. Verify that there are no port conflicts

### Authentication Issues

The scripts use a placeholder JWT token. In a production environment, you would need a valid token from a real authentication flow.

### Missing Dependencies

If you get errors about missing modules:

1. For the Node.js script: `npm install dotenv jsonwebtoken`
2. For the bash script: Make sure `curl` is installed (it usually is by default)

## Customization

You can customize the behavior of these scripts by setting environment variables:

- `API_PORT`: The port the API is running on (default: 3001)

Example:

```bash
API_PORT=3002 npm run check:pipelines
```
