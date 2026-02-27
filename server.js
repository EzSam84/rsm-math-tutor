import express from 'express';
import { fileURLToPath } from 'url';
import { dirname, join } from 'path';
import { config } from 'dotenv';
import tutorHandler from './api/tutor.js';

// Load .env for local development (silently does nothing in production where env vars
// are set through the hosting dashboard)
config();

const __dirname = dirname(fileURLToPath(import.meta.url));
const app = express();

// ─── Security headers (mirrors vercel.json for non-Vercel deployments) ────────
app.use((req, res, next) => {
  res.setHeader('X-Content-Type-Options', 'nosniff');
  res.setHeader('X-Frame-Options', 'DENY');
  res.setHeader('X-XSS-Protection', '1; mode=block');
  res.setHeader('Referrer-Policy', 'strict-origin-when-cross-origin');
  res.setHeader('Permissions-Policy', 'camera=(), microphone=(), geolocation=()');
  res.setHeader('Strict-Transport-Security', 'max-age=63072000; includeSubDomains; preload');
  next();
});

app.use(express.json());

// ─── API ──────────────────────────────────────────────────────────────────────
// The Vercel handler function signature matches Express middleware exactly.
app.post('/api/tutor', tutorHandler);

// ─── Frontend ─────────────────────────────────────────────────────────────────
app.get('*', (req, res) => res.sendFile(join(__dirname, 'index.html')));

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`RSM Math Tutor running on http://localhost:${PORT}`);
});
