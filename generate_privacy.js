/**
 * Generate privacy policy pages for all 8 A&J Tech apps.
 * Per-app SDK data is sourced from actual package.json dependencies.
 *
 * Usage: node generate_privacy.js
 */

const fs = require('fs');
const path = require('path');

const ROOT = __dirname;
const PRIVACY_DIR = path.join(ROOT, 'privacy');

const CONTACT_EMAIL = 'developer@strangervoice.net';
const EFFECTIVE_DATE = 'July 9, 2026';

// Per-app metadata: what the app does + which SDKs it uses
const APPS = {
  knotref: {
    name: 'KnotRef Pro',
    description: 'a reference guide for tying and identifying knots for outdoor, marine, and everyday use',
    sdks: {
      supabase: true,
      firebaseAnalytics: true,
      firebaseCrashlytics: true,
      firebaseRemoteConfig: true,
      firebaseMessaging: false,
      admob: true,
      revenuecat: true,
    },
  },
  shellref: {
    name: 'ShellRef Pro',
    description: 'a reference guide for identifying and learning about seashells, marine mollusks, and shell collecting',
    sdks: {
      supabase: true,
      firebaseAnalytics: true,
      firebaseCrashlytics: true,
      firebaseRemoteConfig: false,
      firebaseMessaging: false,
      admob: true,
      revenuecat: true,
    },
  },
  wildforage: {
    name: 'Wild Foraging Guide Pro',
    description: 'a field guide for identifying edible and medicinal wild plants, foraging safety, and sustainable harvesting',
    sdks: {
      supabase: true,
      firebaseAnalytics: true,
      firebaseCrashlytics: true,
      firebaseRemoteConfig: true,
      firebaseMessaging: false,
      admob: true,
      revenuecat: true,
    },
  },
  trackref: {
    name: 'TrackRef Pro',
    description: 'a reference guide for identifying animal tracks, signs, and wildlife field observations',
    sdks: {
      supabase: true,
      firebaseAnalytics: false,
      firebaseCrashlytics: false,
      firebaseRemoteConfig: false,
      firebaseMessaging: false,
      admob: true,
      revenuecat: true,
    },
  },
  herpetoguide: {
    name: 'HerpetoGuide Pro',
    description: 'a field guide for identifying reptiles and amphibians, with species information and habitat data',
    sdks: {
      supabase: true,
      firebaseAnalytics: false,
      firebaseCrashlytics: false,
      firebaseRemoteConfig: false,
      firebaseMessaging: false,
      admob: true,
      revenuecat: true,
    },
  },
  fieldbuddy: {
    name: 'FieldBuddy',
    description: 'a job tracking and invoicing tool for contractors and field service professionals',
    sdks: {
      supabase: true,
      firebaseAnalytics: true,
      firebaseCrashlytics: true,
      firebaseRemoteConfig: true,
      firebaseMessaging: false,
      admob: true,
      revenuecat: true,
    },
  },
  rockhound: {
    name: 'Rock Hound Pro',
    description: 'a field guide for identifying rocks, minerals, and gemstones, with collection tracking and location logging',
    sdks: {
      supabase: true,
      firebaseAnalytics: true,
      firebaseCrashlytics: true,
      firebaseRemoteConfig: true,
      firebaseMessaging: true,
      admob: true,
      revenuecat: true,
    },
  },
  fossilref: {
    name: 'FossilRef Pro',
    description: 'a reference guide for identifying fossils, with field identification tools and paleontology reference data',
    sdks: {
      supabase: true,
      firebaseAnalytics: true,
      firebaseCrashlytics: true,
      firebaseRemoteConfig: false,
      firebaseMessaging: false,
      admob: true,
      revenuecat: true,
    },
  },
};

function generatePage(slug, meta) {
  const { name, description, sdks } = meta;
  const hasFirebase = sdks.firebaseAnalytics || sdks.firebaseCrashlytics || sdks.firebaseRemoteConfig || sdks.firebaseMessaging;

  // Build data collection list
  const dataItems = [
    `<li><strong>Account information</strong>: If you create an account, we collect your email address and a username to authenticate you and sync your data across devices via our backend provider, Supabase.</li>`,
    `<li><strong>Device information</strong>: We collect device type, operating system version, and device identifiers to help us improve app stability and serve ads.</li>`,
  ];

  if (sdks.firebaseAnalytics) {
    dataItems.push(`<li><strong>Usage analytics</strong>: We collect aggregated usage statistics (screens viewed, features used, session duration) via Firebase Analytics to understand which features are used most frequently.</li>`);
  }

  if (sdks.firebaseCrashlytics) {
    dataItems.push(`<li><strong>Crash and performance data</strong>: We collect crash reports, stack traces, and performance metrics via Firebase Crashlytics to diagnose and fix bugs.</li>`);
  }

  if (sdks.admob) {
    dataItems.push(`<li><strong>Advertising data</strong>: Our app uses Google AdMob to display ads. AdMob may collect device identifiers, coarse location, and usage data to serve ads in accordance with Google's privacy policies.</li>`);
  }

  if (sdks.revenuecat) {
    dataItems.push(`<li><strong>Purchase data</strong>: If you make in-app purchases, we process transaction data via RevenueCat to manage subscriptions and premium features. Payment card data is handled by Google Play Billing — we do not store your card information.</li>`);
  }

  if (sdks.firebaseMessaging) {
    dataItems.push(`<li><strong>Push notification tokens</strong>: We collect device push notification tokens via Firebase Cloud Messaging to send you notifications about app updates and new content. You can disable notifications at any time in your device settings.</li>`);
  }

  dataItems.push(`<li><strong>Local storage</strong>: We store preferences and cached content on your device using local storage. This data remains on your device and is not transmitted to our servers unless you sync your account.</li>`);

  // Build usage list
  const usageItems = [
    `To authenticate users and sync data across devices via Supabase`,
    `To maintain and improve app performance and stability`,
  ];

  if (sdks.firebaseCrashlytics) {
    usageItems.push(`To monitor and fix crashes via Firebase Crashlytics`);
  }
  if (sdks.admob) {
    usageItems.push(`To serve advertisements through Google AdMob`);
  }
  if (sdks.revenuecat) {
    usageItems.push(`To manage in-app purchases and subscriptions via RevenueCat`);
  }
  if (sdks.firebaseAnalytics) {
    usageItems.push(`To analyze usage patterns and improve user experience via Firebase Analytics`);
  }
  if (sdks.firebaseMessaging) {
    usageItems.push(`To send push notifications about app updates and new content via Firebase Cloud Messaging`);
  }

  // Build third-party services list
  const thirdParty = [
    `<li><strong>Supabase</strong> — authentication and database backend. See <a href="https://supabase.com/privacy" target="_blank" rel="noopener">Supabase's Privacy Policy</a>.</li>`,
  ];

  if (sdks.firebaseAnalytics) {
    thirdParty.push(`<li><strong>Google Firebase Analytics</strong> — usage analytics. See <a href="https://firebase.google.com/policies/analytics" target="_blank" rel="noopener">Firebase Analytics Privacy</a>.</li>`);
  }
  if (sdks.firebaseCrashlytics) {
    thirdParty.push(`<li><strong>Google Firebase Crashlytics</strong> — crash reporting. See <a href="https://firebase.google.com/terms/crashlytics" target="_blank" rel="noopener">Firebase Crashlytics Terms</a>.</li>`);
  }
  if (sdks.firebaseRemoteConfig) {
    thirdParty.push(`<li><strong>Google Firebase Remote Config</strong> — feature flagging and configuration. See <a href="https://firebase.google.com/terms/remote-config" target="_blank" rel="noopener">Firebase Remote Config Terms</a>.</li>`);
  }
  if (sdks.firebaseMessaging) {
    thirdParty.push(`<li><strong>Google Firebase Cloud Messaging</strong> — push notifications. See <a href="https://firebase.google.com/cloud-messaging" target="_blank" rel="noopener">Firebase Cloud Messaging</a>.</li>`);
  }
  if (sdks.admob) {
    thirdParty.push(`<li><strong>Google AdMob</strong> — for serving in-app advertisements. See <a href="https://policies.google.com/privacy" target="_blank" rel="noopener">Google's Privacy Policy</a>.</li>`);
  }
  if (sdks.revenuecat) {
    thirdParty.push(`<li><strong>RevenueCat</strong> — in-app purchase and subscription management. See <a href="https://www.revenuecat.com/privacy" target="_blank" rel="noopener">RevenueCat's Privacy Policy</a>.</li>`);
    thirdParty.push(`<li><strong>Google Play Billing</strong> — payment processing for in-app purchases. See <a href="https://payments.google.com/payments/apis-secure/privacy" target="_blank" rel="noopener">Google Pay Privacy</a>.</li>`);
  }

  const html = `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>Privacy Policy — ${name}</title>
  <meta name="description" content="Privacy Policy for ${name} by A&J Tech">
  <style>
    * { box-sizing: border-box; margin: 0; padding: 0; }
    body { font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif; color: #222; background: #fff; line-height: 1.7; }
    .container { max-width: 760px; margin: 0 auto; padding: 48px 24px 80px; }
    header { margin-bottom: 40px; border-bottom: 2px solid #eee; padding-bottom: 24px; }
    header a { text-decoration: none; color: #555; font-size: 14px; }
    h1 { font-size: 2rem; font-weight: 700; margin-top: 12px; margin-bottom: 6px; }
    .subtitle { color: #666; font-size: 1rem; }
    .updated { color: #888; font-size: 0.875rem; margin-top: 4px; }
    h2 { font-size: 1.2rem; font-weight: 600; margin: 36px 0 12px; color: #111; }
    p { margin-bottom: 16px; color: #333; }
    ul { margin: 8px 0 16px 24px; color: #333; }
    ul li { margin-bottom: 6px; }
    a { color: #1a73e8; }
    footer { margin-top: 60px; padding-top: 24px; border-top: 1px solid #eee; font-size: 0.85rem; color: #888; }
  </style>
</head>
<body>
  <div class="container">
    <header>
      <a href="https://aandjtech.com">&larr; aandjtech.com</a>
      <h1>Privacy Policy</h1>
      <div class="subtitle">${name}</div>
      <div class="updated">Effective date: ${EFFECTIVE_DATE}</div>
    </header>

    <p>A&amp;J Tech ("we," "our," or "us") built the <strong>${name}</strong> app as ${description}. This Privacy Policy describes what information we collect, how we use it, and your rights regarding that information.</p>

    <h2>1. Information We Collect</h2>
    <p>${name} is designed to function primarily as an offline reference tool. When you create an account or use online features, we collect the following:</p>
    <ul>
      ${dataItems.join('\n      ')}
    </ul>

    <h2>2. How We Use Information</h2>
    <ul>
      ${usageItems.map(u => `<li>${u}</li>`).join('\n      ')}
    </ul>

    <h2>3. Third-Party Services</h2>
    <p>This app uses the following third-party services that may collect or process information:</p>
    <ul>
      ${thirdParty.join('\n      ')}
    </ul>

    <h2>4. Data Retention</h2>
    <p>Account data is retained as long as your account is active. You can delete your account and associated data at any time by contacting us at <a href="mailto:${CONTACT_EMAIL}">${CONTACT_EMAIL}</a>.${sdks.firebaseAnalytics ? ' Aggregated, anonymized analytics data is retained for up to 12 months.' : ''}${sdks.firebaseCrashlytics ? ' Crash reports are retained for up to 90 days after resolution.' : ''}</p>

    <h2>5. Data Security</h2>
    <p>We use industry-standard practices to protect your data. Supabase provides encrypted data transmission (TLS) and at-rest encryption. Authentication tokens are stored securely on your device.</p>

    <h2>6. Children's Privacy</h2>
    <p>This app is not directed at children under 13. We do not knowingly collect personal information from children under 13. If you believe a child has provided us personal information, please contact us so we can delete it.</p>

    <h2>7. Your Rights</h2>
    <p>Depending on your location, you may have the right to access, correct, or delete information associated with you. To exercise these rights or for any privacy-related questions, contact us at:</p>
    <p><a href="mailto:${CONTACT_EMAIL}">${CONTACT_EMAIL}</a></p>

    <h2>8. Changes to This Policy</h2>
    <p>We may update this Privacy Policy from time to time. We will notify users of any significant changes by updating the "Effective date" above. Continued use of the app after changes constitutes acceptance of the updated policy.</p>

    <h2>9. Contact Us</h2>
    <p>If you have questions about this Privacy Policy, please contact:</p>
    <p>
      A&amp;J Tech<br>
      <a href="mailto:${CONTACT_EMAIL}">${CONTACT_EMAIL}</a><br>
      <a href="https://aandjtech.com">https://aandjtech.com</a>
    </p>

    <footer>
      &copy; 2026 A&amp;J Tech. All rights reserved. &mdash; <a href="https://aandjtech.com">aandjtech.com</a>
    </footer>
  </div>
</body>
</html>
`;
  return html;
}

function generateIndex() {
  const items = Object.entries(APPS).map(([slug, meta]) =>
    `      <li><a href="/privacy/${slug}">${meta.name}</a></li>`
  ).join('\n');

  return `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>Privacy Policies — A&J Tech</title>
  <meta name="description" content="Privacy policies for all A&J Tech mobile apps">
  <style>
    * { box-sizing: border-box; margin: 0; padding: 0; }
    body { font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif; color: #222; background: #fff; line-height: 1.7; }
    .container { max-width: 760px; margin: 0 auto; padding: 48px 24px 80px; }
    header { margin-bottom: 40px; border-bottom: 2px solid #eee; padding-bottom: 24px; }
    header a { text-decoration: none; color: #555; font-size: 14px; }
    h1 { font-size: 2rem; font-weight: 700; margin-top: 12px; margin-bottom: 6px; }
    .subtitle { color: #666; font-size: 1rem; }
    ul { margin: 24px 0 0 0; list-style: none; }
    ul li { border-bottom: 1px solid #eee; }
    ul li a { display: block; padding: 16px 8px; text-decoration: none; color: #1a73e8; font-size: 1.05rem; font-weight: 500; }
    ul li a:hover { background: #f5f8ff; }
    footer { margin-top: 60px; padding-top: 24px; border-top: 1px solid #eee; font-size: 0.85rem; color: #888; }
    footer a { color: #1a73e8; }
  </style>
</head>
<body>
  <div class="container">
    <header>
      <a href="https://aandjtech.com">&larr; aandjtech.com</a>
      <h1>Privacy Policies</h1>
      <div class="subtitle">A&amp;J Tech — Select an app to view its privacy policy</div>
    </header>

    <ul>
${items}
    </ul>

    <footer>
      &copy; 2026 A&amp;J Tech. All rights reserved. &mdash; <a href="https://aandjtech.com">aandjtech.com</a>
    </footer>
  </div>
</body>
</html>
`;
}

// Generate all pages
for (const [slug, meta] of Object.entries(APPS)) {
  const dir = path.join(PRIVACY_DIR, slug);
  if (!fs.existsSync(dir)) {
    fs.mkdirSync(dir, { recursive: true });
  }
  const html = generatePage(slug, meta);
  fs.writeFileSync(path.join(dir, 'index.html'), html, 'utf8');
  console.log(`Generated: privacy/${slug}/index.html (${meta.name})`);
}

// Generate index
const indexHtml = generateIndex();
fs.writeFileSync(path.join(PRIVACY_DIR, 'index.html'), indexHtml, 'utf8');
console.log('Generated: privacy/index.html');

console.log('\nDone — 8 app pages + index generated.');