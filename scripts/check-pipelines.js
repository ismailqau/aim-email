#!/usr/bin/env node

/**
 * AI Email Marketing System - Pipeline Checker Script
 * Copyright (c) 2024 Muhammad Ismail
 * Email: ismail@aimnovo.com
 * Founder: AimNovo.com | AimNexus.ai
 *
 * Script to check pipeline status locally
 */

const fs = require('fs');
const path = require('path');

// Load environment variables
const envPath = path.resolve(__dirname, '../.env');
if (fs.existsSync(envPath)) {
  require('dotenv').config({ path: envPath });
}

// Get API configuration
const API_PORT = process.env.API_PORT || 3501;
const API_BASE_URL = `http://localhost:${API_PORT}`;
const JWT_SECRET = process.env.JWT_SECRET || 'your-jwt-secret';

// Simple JWT token generation for testing
const jwt = require('jsonwebtoken');

// Generate a test token
function generateTestToken() {
  const payload = {
    userId: 'test-user-id',
    companyId: 'test-company-id',
    email: 'test@example.com',
  };

  return jwt.sign(payload, JWT_SECRET, { expiresIn: '1h' });
}

// Make HTTP requests
async function makeRequest(endpoint, options = {}) {
  const url = `${API_BASE_URL}/api/v1${endpoint}`;
  const defaultOptions = {
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${generateTestToken()}`,
    },
  };

  const mergedOptions = { ...defaultOptions, ...options };

  try {
    const response = await fetch(url, mergedOptions);
    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }
    return await response.json();
  } catch (error) {
    console.error(`Error making request to ${url}:`, error.message);
    return null;
  }
}

// Check if API is running
async function checkApiStatus() {
  try {
    const response = await fetch(`${API_BASE_URL}/api/v1/health`);
    return response.ok;
  } catch (error) {
    return false;
  }
}

// Get all pipelines
async function getPipelines() {
  return await makeRequest('/pipelines');
}

// Get pipeline by ID
async function getPipelineById(id) {
  return await makeRequest(`/pipelines/${id}`);
}

// Format pipeline data for display
function formatPipeline(pipeline) {
  return `
Pipeline: ${pipeline.name}
ID: ${pipeline.id}
Description: ${pipeline.description || 'No description'}
Status: ${pipeline.isActive ? 'Active' : 'Inactive'}
Steps: ${pipeline.pipelineSteps ? pipeline.pipelineSteps.length : 0}
Created: ${new Date(pipeline.createdAt).toLocaleString()}
Updated: ${new Date(pipeline.updatedAt).toLocaleString()}
`;
}

// Format pipeline execution data
function formatExecution(execution) {
  return `
Execution: ${execution.id}
Status: ${execution.status}
Started: ${new Date(execution.startedAt).toLocaleString()}
Completed: ${execution.completedAt ? new Date(execution.completedAt).toLocaleString() : 'Not completed'}
Lead: ${execution.lead?.email || 'Unknown'}
`;
}

// Main function
async function main() {
  console.log('🔍 AI Email Marketing System - Pipeline Checker');
  console.log('===============================================\n');

  // Check if API is running
  console.log('Checking if API is running...');
  const apiRunning = await checkApiStatus();

  if (!apiRunning) {
    console.log('❌ API is not running. Please start the API server first:');
    console.log('   Run: npm run dev --filter=api');
    console.log('   Or: cd apps/api && npm run dev');
    return;
  }

  console.log('✅ API is running\n');

  // Get all pipelines
  console.log('Fetching pipelines...');
  const pipelines = await getPipelines();

  if (!pipelines) {
    console.log('❌ Failed to fetch pipelines');
    return;
  }

  if (pipelines.length === 0) {
    console.log('ℹ️  No pipelines found');
    return;
  }

  console.log(`\n📋 Found ${pipelines.length} pipeline(s):\n`);

  // Display pipeline information
  for (const pipeline of pipelines) {
    console.log(formatPipeline(pipeline));

    // If pipeline has executions, show some of them
    if (pipeline.pipelineExecutions && pipeline.pipelineExecutions.length > 0) {
      console.log('Recent Executions:');
      const recentExecutions = pipeline.pipelineExecutions.slice(0, 3);
      for (const execution of recentExecutions) {
        console.log(formatExecution(execution));
      }
      if (pipeline.pipelineExecutions.length > 3) {
        console.log(
          `... and ${pipeline.pipelineExecutions.length - 3} more executions`
        );
      }
    }

    console.log('---');
  }

  // Show detailed information for the first pipeline
  if (pipelines.length > 0) {
    const firstPipeline = pipelines[0];
    console.log(`\n🔍 Detailed view for pipeline: ${firstPipeline.name}`);

    const detailedPipeline = await getPipelineById(firstPipeline.id);
    if (detailedPipeline) {
      console.log(formatPipeline(detailedPipeline));

      // Show steps if available
      if (
        detailedPipeline.pipelineSteps &&
        detailedPipeline.pipelineSteps.length > 0
      ) {
        console.log('Steps:');
        detailedPipeline.pipelineSteps.forEach((step, index) => {
          console.log(
            `  ${index + 1}. ${step.stepType} - Delay: ${step.delayHours} hours`
          );
          if (step.emailTemplate) {
            console.log(`     Template: ${step.emailTemplate.name}`);
          }
        });
      }
    }
  }
}

// Run the script
if (require.main === module) {
  // Install required dependencies if not present
  try {
    require('dotenv');
    require('jsonwebtoken');
  } catch (error) {
    console.log('Installing required dependencies...');
    const { execSync } = require('child_process');
    execSync('npm install dotenv jsonwebtoken', { stdio: 'inherit' });
  }

  main().catch(console.error);
}
