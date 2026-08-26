#!/usr/bin/env bash

# Exit on error, undefined variables, or pipeline failures
set -euo pipefail

# Style definitions for beautiful output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[0;33m'
BLUE='\033[0;34m'
PURPLE='\033[0;35m'
CYAN='\033[0;36m'
BOLD='\033[1m'
NC='\033[0m' # No Color

echo -e "${CYAN}${BOLD}====================================================${NC}"
echo -e "${CYAN}${BOLD}     LUNOVA - GitHub Sync & Deployment Assistant   ${NC}"
echo -e "${CYAN}${BOLD}====================================================${NC}"
echo ""

# 1. Ensure Git is properly initialized
if ! git rev-parse --git-dir >/dev/null 2>&1; then
    echo -e "${YELLOW}⚠️ Git repository not initialized or invalid. Initializing...${NC}"
    rm -rf .git
    git init
    git branch -m main
    echo -e "${GREEN}✓ Git repository initialized with default branch 'main'.${NC}"
else
    CURRENT_BRANCH=$(git branch --show-current 2>/dev/null || echo "")
    if [ -z "$CURRENT_BRANCH" ]; then
        git branch -m main
    fi
    echo -e "${GREEN}✓ Local Git repository is initialized on branch '$(git branch --show-current)'.${NC}"
fi

# 2. Check and configure Git Identity (Local)
CURRENT_USER=$(git config user.name || echo "")
CURRENT_EMAIL=$(git config user.email || echo "")

if [ -z "$CURRENT_USER" ] || [ -z "$CURRENT_EMAIL" ]; then
    echo -e "\n${YELLOW}👤 Configuring your Git Identity (Local to this project):${NC}"
    
    if [ -z "$CURRENT_USER" ]; then
        read -r -p "Enter your GitHub Username [Default: LUNOVA Developer]: " GIT_USER
        if [ -z "$GIT_USER" ]; then GIT_USER="LUNOVA Developer"; fi
        git config user.name "$GIT_USER"
    fi
    
    if [ -z "$CURRENT_EMAIL" ]; then
        read -r -p "Enter your GitHub Email [Default: dev@lunova.app]: " GIT_EMAIL
        if [ -z "$GIT_EMAIL" ]; then GIT_EMAIL="dev@lunova.app"; fi
        git config user.email "$GIT_EMAIL"
    fi
    echo -e "${GREEN}✓ Git Identity updated (Username: $(git config user.name), Email: $(git config user.email)).${NC}"
else
    echo -e "${GREEN}✓ Git Identity verified: ${BOLD}$CURRENT_USER${NC} <$CURRENT_EMAIL>"
fi

# 3. Check and configure Git Remote URL
CURRENT_REMOTE=$(git remote get-url origin 2>/dev/null || echo "")

if [ -z "$CURRENT_REMOTE" ]; then
    echo -e "\n${YELLOW}🔗 No remote origin found. Let's link your GitHub repository:${NC}"
    echo -e "Enter your GitHub Repository URL (e.g., https://github.com/username/repo-name.git):"
    read -r REMOTE_URL
    git remote add origin "$REMOTE_URL"
    echo -e "${GREEN}✓ Remote origin set to: $REMOTE_URL${NC}"
else
    echo -e "${GREEN}✓ Remote origin is linked to: ${BOLD}$CURRENT_REMOTE${NC}"
    read -r -p "Would you like to change/update this remote URL? (y/N): " CHANGE_REMOTE
    if [[ "$CHANGE_REMOTE" =~ ^[Yy]$ ]]; then
        read -r -p "Enter new GitHub Repository URL: " REMOTE_URL
        git remote set-url origin "$REMOTE_URL"
        echo -e "${GREEN}✓ Remote origin updated to: $REMOTE_URL${NC}"
    fi
fi

# 4. Stage and display changes
echo -e "\n${CYAN}📦 Staging changes...${NC}"
git add .
STAGED_COUNT=$(git status --porcelain | wc -l)

if [ "$STAGED_COUNT" -eq 0 ]; then
    echo -e "${GREEN}✓ Everything is up to date! No changes to stage or commit.${NC}"
else
    echo -e "${GREEN}✓ Staged $STAGED_COUNT changed files.${NC}"
    echo -e "${CYAN}--- Staged Files ---${NC}"
    git status --short
    echo -e "${CYAN}--------------------${NC}"
fi

# 5. Commit Changes
read -r -p "Enter commit message [Default: 'Sync from Google AI Studio']: " COMMIT_MSG
if [ -z "$COMMIT_MSG" ]; then
    COMMIT_MSG="Sync from Google AI Studio"
fi

# We use '|| true' because git commit exits with non-zero if there's nothing new to commit
git commit -m "$COMMIT_MSG" || echo -e "${YELLOW}No new changes committed.${NC}"

# 6. Branch name setup
CURRENT_BRANCH=$(git branch --show-current || echo "main")
read -r -p "Enter remote branch name to push to [Default: '$CURRENT_BRANCH']: " TARGET_BRANCH
if [ -z "$TARGET_BRANCH" ]; then
    TARGET_BRANCH="$CURRENT_BRANCH"
fi

if [ "$CURRENT_BRANCH" != "$TARGET_BRANCH" ]; then
    git branch -m "$TARGET_BRANCH"
    echo -e "${GREEN}✓ Local branch renamed to '$TARGET_BRANCH'.${NC}"
fi

# 7. Authenticate and Push using Personal Access Token (PAT)
echo -e "\n${YELLOW}🔑 GitHub HTTPS Authentication:${NC}"
echo -e "Since GitHub disabled password authentication in 2021, you must use a ${BOLD}Personal Access Token (PAT)${NC}."
echo -e "If you don't have one, create it here: ${BLUE}https://github.com/settings/tokens${NC}"
echo -e "Required Scopes: ${BOLD}repo${NC}"
echo ""

read -r -p "Enter your GitHub Username: " AUTH_USER
if [ -z "$AUTH_USER" ]; then
    AUTH_USER=$(git config user.name)
fi

# Hide token input in the terminal for security
read -r -s -p "Enter your GitHub Personal Access Token (PAT): " AUTH_TOKEN
echo ""

if [ -z "$AUTH_TOKEN" ]; then
    echo -e "${RED}❌ Token cannot be empty. Aborting push.${NC}"
    exit 1
fi

# Get current clean origin URL
REMOTE_CLEAN=$(git remote get-url origin | sed -E 's/https?:\/\///' | sed -E 's/[^@]+@//')

# Construct the authenticated URL securely (do not print or log this)
AUTH_REMOTE_URL="https://${AUTH_USER}:${AUTH_TOKEN}@${REMOTE_CLEAN}"

echo -e "\n${BLUE}🚀 Pushing changes to branch '$TARGET_BRANCH' on origin...${NC}"

# Run git push, masking credentials if any error output happens
if git push -u "$AUTH_REMOTE_URL" "$TARGET_BRANCH" 2>/tmp/git_push_err; then
    PUSH_SUCCESS=true
else
    PUSH_SUCCESS=false
fi

if [ "$PUSH_SUCCESS" = false ]; then
    ERR_MSG=$(cat /tmp/git_push_err)
    if echo "$ERR_MSG" | grep -qE "rejected|non-fast-forward|behind"; then
        echo -e "\n${YELLOW}⚠️ Standard push rejected because remote branch has different commits.${NC}"
        echo -e "Would you like to force update branch '$TARGET_BRANCH' with your latest Google AI Studio code? (Y/n):"
        read -r FORCE_PUSH_ANS
        if [[ ! "$FORCE_PUSH_ANS" =~ ^[Nn]$ ]]; then
            echo -e "${BLUE}🚀 Force-pushing latest AI Studio code to GitHub...${NC}"
            if git push -u "$AUTH_REMOTE_URL" "$TARGET_BRANCH" --force 2>/tmp/git_push_err; then
                PUSH_SUCCESS=true
            fi
        fi
    fi
fi

if [ "$PUSH_SUCCESS" = true ]; then
    echo -e "\n${GREEN}${BOLD}🎉 SUCCESS! Your latest Google AI Studio changes have been pushed to GitHub!${NC}"
    echo -e "${GREEN}⚡ Netlify will automatically detect this commit and publish the updated site in ~1-2 minutes.${NC}"
    
    # Save the authenticated remote temporarily so subsequent fast pushes work in this session
    read -r -p "Save these credentials locally for this session? (y/N): " SAVE_CREDS
    if [[ "$SAVE_CREDS" =~ ^[Yy]$ ]]; then
        git remote set-url origin "$AUTH_REMOTE_URL"
        echo -e "${YELLOW}⚠️ Saved to local .git/config.${NC}"
    else
        git remote set-url origin "https://${REMOTE_CLEAN}"
    fi
    rm -f /tmp/git_push_err
else
    echo -e "\n${RED}❌ Push failed! Here is the error output from Git:${NC}"
    sed "s/${AUTH_TOKEN}/[REDACTED_TOKEN]/g" /tmp/git_push_err
    rm -f /tmp/git_push_err
    exit 1
fi
