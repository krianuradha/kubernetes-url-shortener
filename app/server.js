const express = require('express');
const crypto = require('crypto');

const app = express();
const PORT = process.env.PORT || 3000;

// Middleware: parse incoming JSON request bodies
app.use(express.json());

// In-memory store: { shortId: originalUrl }
// Example: { "abc123": "https://google.com" }
// NOTE: This resets every time the app restarts. That is intentional.
const urlStore = {};

// ─────────────────────────────────────────────
// GET /
// Health check — confirms the API is running
// ─────────────────────────────────────────────
app.get('/', (req, res) => {
  res.json({ message: 'URL Shortener is running' });
});

// ─────────────────────────────────────────────
// POST /shorten
// Accepts: { "url": "https://example.com" }
// Returns: { "shortUrl": "/abc123" }
// ─────────────────────────────────────────────
app.post('/shorten', (req, res) => {
  const { url } = req.body;

  // Validate: url must be present
  if (!url) {
    return res.status(400).json({ error: 'Please provide a "url" field in the request body' });
  }

  // Validate: must look like a real URL
  try {
    new URL(url); // throws if invalid
  } catch {
    return res.status(400).json({ error: 'Invalid URL. Make sure it starts with http:// or https://' });
  }

  // Generate a 6-character random ID using Node's built-in crypto module
  // crypto.randomBytes(3) gives 3 random bytes → hex string is 6 chars
  // Example: "a3f8c1"
  const shortId = crypto.randomBytes(3).toString('hex');

  // Store the mapping
  urlStore[shortId] = url;

  console.log(`[SHORTEN] ${shortId} → ${url}`);

  res.status(201).json({
    shortId,
    shortUrl: `/${shortId}`,
    originalUrl: url,
  });
});

// ─────────────────────────────────────────────
// GET /:shortId
// Redirects to the original URL
// Returns 404 if shortId is not found
// ─────────────────────────────────────────────
app.get('/:shortId', (req, res) => {
  const { shortId } = req.params;
  const originalUrl = urlStore[shortId];

  if (!originalUrl) {
    return res.status(404).json({
      error: `Short URL "/${shortId}" not found. It may have never existed, or the app restarted.`,
    });
  }

  console.log(`[REDIRECT] /${shortId} → ${originalUrl}`);

  // 302 = temporary redirect (standard for URL shorteners)
  res.redirect(302, originalUrl);
});

// ─────────────────────────────────────────────
// Start the server
// ─────────────────────────────────────────────
app.listen(PORT, () => {
  console.log(`URL Shortener running on port ${PORT}`);
  console.log(`Health check: http://localhost:${PORT}/`);
});
