#!/bin/bash

# AI Email Marketing System - Git Setup Script
# Copyright (c) 2024 Muhammad Ismail
# Email: ismail@aimnovo.com
# Founder: AimNovo.com | AimNexus.ai
# 
# Licensed under the MIT License.
# See LICENSE file in the project root for full license information.
# 
# For commercial use, please maintain proper attribution.

# Git Setup Script for AI Email Marketing System
# This script configures Git with project-specific settings

echo "🔧 Setting up Git configuration for AI Email Marketing System..."

# Set commit message template
git config commit.template .gitmessage
echo "✅ Commit message template configured"

# Set pull strategy to rebase to maintain clean history
git config pull.rebase true
echo "✅ Pull strategy set to rebase"

# Set default branch name (if creating new repositories)
git config init.defaultBranch main
echo "✅ Default branch set to 'main'"

# Configure line ending handling
git config core.autocrlf input
echo "✅ Line ending handling configured"

# Set up helpful Git aliases
git config alias.st status
git config alias.co checkout
git config alias.br branch
git config alias.ci commit
git config alias.unstage 'reset HEAD --'
git config alias.last 'log -1 HEAD'
git config alias.visual '!gitk'
git config alias.graph 'log --oneline --graph --decorate --all'
git config alias.conflicts 'diff --name-only --diff-filter=U'
echo "✅ Helpful Git aliases configured"

# Verify configuration
echo ""
echo "📋 Git Configuration Summary:"
echo "├── Commit template: $(git config commit.template)"
echo "├── Pull strategy: $(git config pull.rebase)"
echo "├── Default branch: $(git config init.defaultBranch)"
echo "├── Line endings: $(git config core.autocrlf)"
echo "└── Aliases: st, co, br, ci, unstage, last, visual, graph, conflicts"

echo ""
echo "🎉 Git setup complete!"
echo "💡 Tip: Use 'git ci' to commit with the template, or 'git graph' to see project history"