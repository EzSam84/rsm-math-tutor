#!/usr/bin/env node
/**
 * Sets up GitHub labels for rsm-math-tutor.
 * No dependencies — uses Node.js built-in https module.
 *
 * Usage:
 *   1. Create a token at https://github.com/settings/tokens/new
 *      → Select scopes: repo (full)
 *   2. node scripts/setup-github-labels.js YOUR_TOKEN_HERE
 */

const https = require("https");

const TOKEN = process.argv[2];
const REPO = "EzSam84/rsm-math-tutor";

if (!TOKEN) {
  console.error("Usage: node scripts/setup-github-labels.js YOUR_GITHUB_TOKEN");
  console.error("Get a token at: https://github.com/settings/tokens/new");
  process.exit(1);
}

const LABELS = [
  // Type
  { name: "feature",      color: "0075ca", description: "New feature or request" },
  { name: "bug",          color: "d73a4a", description: "Something isn't working" },
  { name: "improvement",  color: "a2eeef", description: "Enhancement to existing functionality" },
  { name: "chore",        color: "e4e669", description: "Maintenance, refactoring, or tooling" },
  { name: "ui/ux",        color: "f9d0c4", description: "Visual or experience improvement" },
  // Priority
  { name: "priority: high",   color: "b60205", description: "Urgent or blocking" },
  { name: "priority: medium", color: "e99695", description: "Important but not urgent" },
  { name: "priority: low",    color: "f7c6c7", description: "Nice to have" },
  // Status
  { name: "status: backlog",      color: "c5def5", description: "Not yet planned" },
  { name: "status: in progress",  color: "0052cc", description: "Actively being worked on" },
  { name: "status: blocked",      color: "e11d48", description: "Waiting on something" },
  // Area
  { name: "area: content",   color: "d4edda", description: "Lesson content, problems, or explanations" },
  { name: "area: ai/tutor",  color: "cce5ff", description: "AI tutor logic, prompting, or responses" },
  { name: "area: auth",      color: "fff3cd", description: "Authentication or user accounts" },
  { name: "area: progress",  color: "d1ecf1", description: "Progress tracking or reporting" },
  { name: "area: api",       color: "e2d9f3", description: "Backend API or integrations" },
];

function request(method, path, body = null) {
  return new Promise((resolve, reject) => {
    const options = {
      hostname: "api.github.com",
      path,
      method,
      headers: {
        Authorization: `token ${TOKEN}`,
        "User-Agent": "rsm-math-tutor-setup",
        "Content-Type": "application/json",
        Accept: "application/vnd.github+json",
      },
    };

    const req = https.request(options, (res) => {
      let data = "";
      res.on("data", (chunk) => (data += chunk));
      res.on("end", () => resolve({ status: res.statusCode, body: data }));
    });

    req.on("error", reject);
    if (body) req.write(JSON.stringify(body));
    req.end();
  });
}

async function run() {
  console.log(`Setting up labels for ${REPO}...\n`);

  for (const label of LABELS) {
    // Try to create; if it exists (422), update it instead
    const create = await request("POST", `/repos/${REPO}/labels`, label);

    if (create.status === 201) {
      console.log(`  ✓ Created: ${label.name}`);
    } else if (create.status === 422) {
      const encoded = encodeURIComponent(label.name);
      const update = await request("PATCH", `/repos/${REPO}/labels/${encoded}`, label);
      console.log(update.status === 200 ? `  ~ Updated: ${label.name}` : `  ✗ Failed:  ${label.name}`);
    } else {
      console.log(`  ✗ Failed:  ${label.name} (HTTP ${create.status})`);
    }
  }

  console.log(`\nDone! View labels at: https://github.com/${REPO}/labels`);
}

run().catch(console.error);
