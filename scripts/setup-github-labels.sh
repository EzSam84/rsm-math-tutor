#!/bin/bash
# Run this script once from your local machine to set up GitHub labels.
# Requirements: gh CLI installed and authenticated (run `gh auth login` first)
# Usage: bash scripts/setup-github-labels.sh

REPO="EzSam84/rsm-math-tutor"

echo "Setting up labels for $REPO..."

# Delete default labels that aren't useful
DEFAULTS=("documentation" "duplicate" "good first issue" "help wanted" "invalid" "question" "wontfix")
for label in "${DEFAULTS[@]}"; do
  gh label delete "$label" --repo "$REPO" --yes 2>/dev/null
done

# Create labels
# Format: gh label create "name" --color "hex" --description "desc" --repo $REPO

# --- Type ---
gh label create "feature" --color "0075ca" --description "New feature or request" --repo "$REPO" --force
gh label create "bug" --color "d73a4a" --description "Something isn't working" --repo "$REPO" --force
gh label create "improvement" --color "a2eeef" --description "Enhancement to existing functionality" --repo "$REPO" --force
gh label create "chore" --color "e4e669" --description "Maintenance, refactoring, or tooling" --repo "$REPO" --force
gh label create "ui/ux" --color "f9d0c4" --description "Visual or experience improvement" --repo "$REPO" --force

# --- Priority ---
gh label create "priority: high" --color "b60205" --description "Urgent or blocking" --repo "$REPO" --force
gh label create "priority: medium" --color "e99695" --description "Important but not urgent" --repo "$REPO" --force
gh label create "priority: low" --color "f7c6c7" --description "Nice to have" --repo "$REPO" --force

# --- Status ---
gh label create "status: backlog" --color "c5def5" --description "Not yet planned" --repo "$REPO" --force
gh label create "status: in progress" --color "0052cc" --description "Actively being worked on" --repo "$REPO" --force
gh label create "status: blocked" --color "e11d48" --description "Waiting on something" --repo "$REPO" --force

# --- Area ---
gh label create "area: content" --color "d4edda" --description "Lesson content, problems, or explanations" --repo "$REPO" --force
gh label create "area: ai/tutor" --color "cce5ff" --description "AI tutor logic, prompting, or responses" --repo "$REPO" --force
gh label create "area: auth" --color "fff3cd" --description "Authentication or user accounts" --repo "$REPO" --force
gh label create "area: progress" --color "d1ecf1" --description "Progress tracking or reporting" --repo "$REPO" --force
gh label create "area: api" --color "e2d9f3" --description "Backend API or integrations" --repo "$REPO" --force

echo ""
echo "Done! Labels created at: https://github.com/$REPO/labels"
echo ""
echo "Next step: Create a Project board at https://github.com/EzSam84?tab=projects"
