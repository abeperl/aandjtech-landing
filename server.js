const express = require('express');
const path = require('path');
const fs = require('fs');

const app = express();
const PORT = process.env.PORT || 3000;
const ROOT = __dirname;

// Map of subdomains to their app directories
const APP_SUBDOMAINS = {
  fieldbuddy: 'apps/fieldbuddy',
  wildforage: 'apps/wildforage',
  rockhound: 'apps/rockhound',
  knotref: 'apps/knotref',
  herpetoguide: 'apps/herpetoguide',
  trackref: 'apps/trackref',
  shellref: 'apps/shellref',
  fossilref: 'apps/fossilref',
};

// Extract subdomain from hostname (e.g. "fossilref" from "fossilref.aandjtech.com")
function getSubdomain(hostname) {
  if (!hostname) return null;
  const parts = hostname.split('.');
  // Handle Railway preview URLs like fossilref.aandjtech.up.railway.app
  // Or aandjtech.com subdomains like fossilref.aandjtech.com
  if (parts.length >= 2) {
    return parts[0];
  }
  return null;
}

// Parse JSON request bodies (for waitlist API)
app.use(express.json());

// Waitlist signup endpoint
app.post('/api/waitlist', (req, res) => {
  const { name, email, app: appName } = req.body || {};
  if (!email || !email.includes('@')) {
    return res.status(400).json({ error: 'Valid email required' });
  }
  const entry = {
    name: (name || '').trim(),
    email: email.trim().toLowerCase(),
    app: (appName || '').trim(),
    timestamp: new Date().toISOString(),
  };
  const dataFile = path.join(ROOT, 'waitlist.json');
  let list = [];
  try { list = JSON.parse(fs.readFileSync(dataFile, 'utf8')); } catch {}
  // Deduplicate by email + app
  const exists = list.some(e => e.email === entry.email && e.app === entry.app);
  if (!exists) {
    list.push(entry);
    fs.writeFileSync(dataFile, JSON.stringify(list, null, 2));
  }
  res.json({ status: 'ok' });
});

// Serve /apps directory — hub page + individual app pages on the main domain
// (Subdomain routing below handles fieldbuddy.aandjtech.com etc.)
app.use('/apps', express.static(path.join(ROOT, 'apps'), {
  index: 'index.html',
  redirect: false,
}));
// Fallback: serve index.html for /apps (no trailing slash) and /apps/<name> (no trailing slash)
app.get(['/apps', '/apps/:appname'], (req, res, next) => {
  const appDir = req.params.appname ? path.join(ROOT, 'apps', req.params.appname) : path.join(ROOT, 'apps');
  const indexFile = path.join(appDir, 'index.html');
  if (fs.existsSync(indexFile)) {
    res.sendFile(indexFile);
  } else {
    next();
  }
});

// Middleware: route by subdomain
app.use((req, res, next) => {
  // Railway overwrites X-Forwarded-Host; honor X-Original-Host set by the Cloudflare Worker
  const hostname = req.headers['x-original-host'] || req.hostname || req.headers.host || '';
  const sub = getSubdomain(hostname);

  if (sub && APP_SUBDOMAINS[sub]) {
    const appDir = path.join(ROOT, APP_SUBDOMAINS[sub]);
    // Serve static files from the app directory
    express.static(appDir)(req, res, () => {
      // Fall through to index.html for SPA-style routing
      const indexFile = path.join(appDir, 'index.html');
      if (fs.existsSync(indexFile)) {
        res.sendFile(indexFile);
      } else {
        next();
      }
    });
  } else {
    next();
  }
});

// Serve main aandjtech.com site static files
app.use(express.static(ROOT, {
  // Don't serve apps/ or server.js as static files from root
  index: 'index.html',
}));

// Fallback: serve main index.html for root domain
app.get('*', (req, res) => {
  res.sendFile(path.join(ROOT, 'index.html'));
});

app.listen(PORT, () => {
  console.log(`A&J Tech landing server running on port ${PORT}`);
  console.log(`Serving subdomains: ${Object.keys(APP_SUBDOMAINS).join(', ')}`);
});
