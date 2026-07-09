/**
 * AAN-895: SEO Content Engine — Printables page generator
 * 
 * Reads printables/keywords.json and generates:
 *   - printables/index.html (hub page with all printable cards)
 *   - printables/<slug>.html (one SEO-optimized page per keyword)
 *   - sitemap.xml (all printables URLs)
 * 
 * Pages include: intro, what's included, who it's for, how to use,
 * tips, product links (Etsy/Gumroad/LS), FAQ, related printables.
 * 
 * Usage: node generate_printables.js
 */

const fs = require('fs');
const path = require('path');

const ROOT = __dirname;
const PRINTABLES_DIR = path.join(ROOT, 'printables');

// ─── Helpers ───

function slugify(text) {
  return text.toLowerCase()
    .replace(/[^\w\s-]/g, '')
    .replace(/[\s_-]+/g, '-')
    .replace(/^-+|-+$/g, '');
}

function truncate(text, maxLen) {
  if (text.length <= maxLen) return text;
  return text.substring(0, maxLen - 3) + '...';
}

// ─── SEO Content Generation ───

function generatePageBody(kw, allKeywords) {
  const keyword = kw.keyword;
  const h1 = kw.h1;
  const products = kw.products;
  const titleShort = h1.split('—')[0].trim();
  const keywordTitle = keyword.charAt(0).toUpperCase() + keyword.slice(1);

  // Intro
  let html = `<p class="lead">If you're looking for a ${keyword}, you're in the right place. Our collection of ${keyword} templates is designed to help you stay organized, save time, and get results — whether you're planning your week, tracking habits, or managing a major life event. Each printable is carefully crafted with clean layouts, practical sections, and a design that actually works for real life (not just Instagram photos).</p>\n`;

  // What's included
  html += `<section class="content-section"><h2>What's Included in the ${titleShort}</h2><ul class="feature-list">\n`;
  const features = [
    'Printable PDF pages you can download instantly and print at home or at a local print shop',
    "Clean, minimalist design that's easy on ink and works on any printer (letter and A4 sizes included)",
    "Practical sections that address real use cases — not filler pages you'll never use",
    'Digital file means no shipping costs, no waiting, and you can print as many copies as you need',
    'Compatible with GoodNotes, Notability, and other PDF annotation apps for iPad and tablet users',
  ];
  features.forEach(f => { html += `<li>${f}</li>\n`; });
  html += `</ul></section>\n`;

  // Who is this for
  html += `<section class="content-section"><h2>Who Is This ${keywordTitle} For?</h2><p>This ${keyword} is perfect for anyone who wants to get organized without spending hours designing their own system. Whether you're a busy parent, a student on a budget, a teacher managing multiple classes, or someone who simply loves the satisfaction of checking things off a list — these printables are built to be practical, not pretty clutter. If you've tried digital apps and found them too complex, or bought planners that had too many pages you never used, this is the streamlined alternative.</p></section>\n`;

  // How to use
  html += `<section class="content-section"><h2>How to Use Your ${keywordTitle}</h2><p>Getting started takes about five minutes. After purchase, you'll receive an instant download link. Print the pages you need on standard letter-size paper (8.5" × 11") or A4 paper, depending on your region. Three-hole punch them for a binder, or slip them into a dry-erase sleeve for reusable daily tracking. Prefer digital? Import the PDF into your favorite note-taking app and use it on your tablet with a stylus.</p></section>\n`;

  // Tips
  html += `<section class="content-section"><h2>Tips for Getting the Most Out of Your Printable</h2><ul class="feature-list">\n`;
  const tips = [
    'Print on cardstock (65lb or heavier) for pages you\'ll use repeatedly, like weekly dashboards',
    'Laminate frequently-used pages and use dry-erase markers to avoid reprinting',
    'Store your printables in a dedicated binder with tab dividers by month or category',
    "Set a weekly reminder to print and prep your pages for the coming week — consistency is key",
    "Don't print everything at once. Start with the core pages and add more as you build the habit",
  ];
  tips.forEach(t => { html += `<li>${t}</li>\n`; });
  html += `</ul></section>\n`;

  // Product links
  html += `<section class="content-section"><h2>Get Your ${titleShort}</h2><p>Ready to download? Choose your preferred marketplace below:</p><div class="product-links">\n`;
  products.forEach(p => {
    const platformClass = `platform-${p.platform.toLowerCase()}`;
    html += `<div class="product-card"><h3><a href="${p.url}" target="_blank" rel="noopener">${p.title}</a></h3><span class="product-platform ${platformClass}">${p.platform.charAt(0).toUpperCase() + p.platform.slice(1)}</span></div>\n`;
  });
  html += `</div></section>\n`;

  // FAQ
  const faqs = [
    { q: `Is this ${keyword} a physical product or a digital download?`, a: "It's a digital download. After purchase, you'll receive a link to download the PDF file(s) instantly. No physical item will be shipped. You can print it at home, at a print shop, or use it digitally on a tablet." },
    { q: 'What paper size are the printables designed for?', a: 'Our printables are designed for both US Letter (8.5" × 11") and A4 (210mm × 297mm) paper sizes. Most pages work on either size with minimal adjustment.' },
    { q: 'Can I use these printables on my iPad or tablet?', a: 'Yes! The PDF files are fully compatible with popular annotation apps including GoodNotes, Notability, OneNote, and Xodo. Import the PDF and write directly on the pages with a stylus.' },
    { q: 'How many times can I print the pages?', a: "As many as you want. The digital file is yours to keep. Print one copy or a hundred — there's no limit. This is one of the biggest advantages of printables over pre-printed planners." },
    { q: 'Do you offer refunds?', a: "Because these are digital products that can't be 'returned,' refunds are handled on a case-by-case basis through the marketplace where you purchased (Etsy, Gumroad, or LemonSqueezy). If you have any issues with your download, reach out and we'll make it right." },
  ];
  html += `<section class="content-section"><h2>Frequently Asked Questions</h2>\n`;
  faqs.forEach(faq => {
    html += `<div class="faq-item"><h3>${faq.q}</h3><p>${faq.a}</p></div>\n`;
  });
  html += `</section>\n`;

  // CTA
  html += `<div class="cta-box"><h2>Start Organizing Today</h2><p>Instant download. Print at home. Use forever.</p><a class="cta-btn" href="${products[0].url}" target="_blank" rel="noopener">Get Your ${titleShort} →</a></div>\n`;

  // Related
  const related = allKeywords.filter(k => k.slug !== kw.slug).slice(0, 4);
  html += `<section class="content-section"><h2>Related Printables</h2><div class="related-links">\n`;
  related.forEach(r => {
    const rTitle = r.h1.split('—')[0].trim();
    html += `<a href="/printables/${r.slug}.html">${rTitle}</a>\n`;
  });
  html += `</div></section>\n`;

  return html;
}

function generateIndividualPage(kw, allKeywords) {
  const slug = kw.slug;
  const title = kw.h1;
  const keyword = kw.keyword;
  const metaDesc = truncate(`Download a premium ${keyword} — instant PDF download, print at home or use on tablet. Clean design, practical layouts, no filler pages.`, 160);
  const products = kw.products;
  const body = generatePageBody(kw, allKeywords);
  const titleShort = title.split('—')[0].trim();
  const pageUrl = `https://aandjtech.com/printables/${slug}.html`;

  // JSON-LD: BreadcrumbList
  const breadcrumbLd = {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    "itemListElement": [
      { "@type": "ListItem", "position": 1, "name": "Home", "item": "https://aandjtech.com/" },
      { "@type": "ListItem", "position": 2, "name": "Printables", "item": "https://aandjtech.com/printables" },
      { "@type": "ListItem", "position": 3, "name": titleShort, "item": pageUrl }
    ]
  };

  // JSON-LD: FAQPage
  const faqLd = {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    "mainEntity": [
      { "@type": "Question", "name": `Is this ${keyword} a physical product or a digital download?`, "acceptedAnswer": { "@type": "Answer", "text": "It's a digital download. After purchase, you'll receive a link to download the PDF file(s) instantly. No physical item will be shipped. You can print it at home, at a print shop, or use it digitally on a tablet." } },
      { "@type": "Question", "name": "What paper size are the printables designed for?", "acceptedAnswer": { "@type": "Answer", "text": "Our printables are designed for both US Letter (8.5 x 11 inches) and A4 (210mm x 297mm) paper sizes. Most pages work on either size with minimal adjustment." } },
      { "@type": "Question", "name": "Can I use these printables on my iPad or tablet?", "acceptedAnswer": { "@type": "Answer", "text": "Yes! The PDF files are fully compatible with popular annotation apps including GoodNotes, Notability, OneNote, and Xodo. Import the PDF and write directly on the pages with a stylus." } },
      { "@type": "Question", "name": "How many times can I print the pages?", "acceptedAnswer": { "@type": "Answer", "text": "As many as you want. The digital file is yours to keep. Print one copy or a hundred — there's no limit. This is one of the biggest advantages of printables over pre-printed planners." } },
      { "@type": "Question", "name": "Do you offer refunds?", "acceptedAnswer": { "@type": "Answer", "text": "Because these are digital products that can't be returned, refunds are handled on a case-by-case basis through the marketplace where you purchased (Etsy, Gumroad, or LemonSqueezy). If you have any issues with your download, reach out and we'll make it right." } }
    ]
  };

  // JSON-LD: Product
  const productLd = {
    "@context": "https://schema.org",
    "@type": "Product",
    "name": titleShort,
    "description": metaDesc,
    "category": "Printable",
    "offers": products.map(p => ({
      "@type": "Offer",
      "price": p.price || "See listing",
      "priceCurrency": "USD",
      "availability": "https://schema.org/InStock",
      "url": p.url,
      "seller": { "@type": "Organization", "name": p.platform.charAt(0).toUpperCase() + p.platform.slice(1) }
    }))
  };

  const allLd = [breadcrumbLd, faqLd, productLd]
    .map(obj => `<script type="application/ld+json">${JSON.stringify(obj)}</script>`)
    .join('\n    ');

  return `<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>${title}</title>
    <meta name="description" content="${metaDesc}">
    <link rel="canonical" href="${pageUrl}">
    <link rel="stylesheet" href="/style.css">
    <meta property="og:title" content="${title}">
    <meta property="og:description" content="${metaDesc}">
    <meta property="og:type" content="website">
    <meta property="og:url" content="${pageUrl}">
    <meta name="twitter:card" content="summary">
    <meta name="twitter:title" content="${title}">
    <meta name="twitter:description" content="${metaDesc}">
    ${allLd}
</head>
<body>
    <header>
        <div class="logo">A<span>&amp;</span>J Tech</div>
        <nav>
            <a href="/">Home</a>
            <a href="/printables" class="active">Printables</a>
        </nav>
    </header>
    <main>
        <div class="breadcrumbs">
            <a href="/">Home</a><span>/</span><a href="/printables">Printables</a><span>/</span>${titleShort}
        </div>
        <h1>${title}</h1>
        ${body}
    </main>
    <footer>
        <div><a href="/printables">← Back to All Printables</a></div>
        <p>&copy; 2026 A&amp;J Tech. All rights reserved.</p>
    </footer>
</body>
</html>`;
}

function generateHubPage(keywords) {
  let cardsHtml = '';
  keywords.forEach(kw => {
    const titleShort = kw.h1.split('—')[0].trim();
    const desc = `Download a premium ${kw.keyword} — instant PDF, print at home or use on tablet.`;
    cardsHtml += `            <div class="printable-card">
                <h2><a href="/printables/${kw.slug}.html">${titleShort}</a></h2>
                <p>${desc}</p>
            </div>\n`;
  });

  return `<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Printables &amp; Planners — A&amp;J Tech</title>
    <meta name="description" content="Browse our collection of ${keywords.length} premium printable planners, journals, trackers, and templates. Instant download, print at home, or use on your tablet.">
    <link rel="canonical" href="https://aandjtech.com/printables">
    <link rel="stylesheet" href="/style.css">
    <meta property="og:title" content="Printables & Planners — A&J Tech">
    <meta property="og:description" content="Browse our collection of premium printable planners, journals, trackers, and templates. Instant download, print at home, or use on your tablet.">
    <meta property="og:type" content="website">
    <meta name="twitter:card" content="summary">
    <meta name="twitter:title" content="Printables & Planners — A&J Tech">
    <meta name="twitter:description" content="Browse our collection of premium printable planners, journals, trackers, and templates. Instant download, print at home, or use on your tablet.">
    <script type="application/ld+json">{"@context":"https://schema.org","@type":"CollectionPage","name":"Premium Printables Collection","description":"Browse our collection of ${keywords.length} premium printable planners, journals, trackers, and templates. Instant download, print at home, or use on your tablet.","url":"https://aandjtech.com/printables","isPartOf":{"@type":"WebSite","name":"A&J Tech","url":"https://aandjtech.com"}}</script>
</head>
<body>
    <header>
        <div class="logo">A<span>&amp;</span>J Tech</div>
        <nav>
            <a href="/">Home</a>
            <a href="/printables" class="active">Printables</a>
        </nav>
    </header>
    <main>
        <h1>Premium Printables Collection</h1>
        <p class="lead">Discover our collection of ${keywords.length} thoughtfully crafted planners, journals, business templates, and productivity tools. Everything is instantly downloadable and ready to use — print at home or on your tablet.</p>
        
        <div class="printables-grid">
${cardsHtml}        </div>
        
        <div class="cta-box">
            <h2>Can't Find What You Need?</h2>
            <p>We're always adding new printables. Check our Etsy shop for the full catalog.</p>
            <a class="cta-btn" href="https://www.etsy.com/shop/AANDJTech" target="_blank" rel="noopener">Browse Etsy Shop →</a>
        </div>
    </main>
    <footer>
        <div><a href="/">← Back to Home</a></div>
        <p>&copy; 2026 A&amp;J Tech. All rights reserved.</p>
    </footer>
</body>
</html>`;
}

function generateSitemap(keywords) {
  const today = new Date().toISOString().split('T')[0];
  let xml = '<?xml version="1.0" encoding="UTF-8"?>\n';
  xml += '<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">\n';
  xml += '    <url>\n';
  xml += '        <loc>https://aandjtech.com/printables</loc>\n';
  xml += `        <lastmod>${today}</lastmod>\n`;
  xml += '        <changefreq>weekly</changefreq>\n';
  xml += '        <priority>0.8</priority>\n';
  xml += '    </url>\n';
  keywords.forEach(kw => {
    xml += '    <url>\n';
    xml += `        <loc>https://aandjtech.com/printables/${kw.slug}.html</loc>\n`;
    xml += `        <lastmod>${today}</lastmod>\n`;
    xml += '        <changefreq>monthly</changefreq>\n';
    xml += '        <priority>0.6</priority>\n';
    xml += '    </url>\n';
  });
  xml += '</urlset>';
  return xml;
}

// ─── Main ───

const keywords = JSON.parse(fs.readFileSync(path.join(PRINTABLES_DIR, 'keywords.json'), 'utf8'));
const currentSlugs = new Set(keywords.map(k => k.slug));

// Hub page
fs.writeFileSync(path.join(PRINTABLES_DIR, 'index.html'), generateHubPage(keywords));
console.log(`Generated printables/index.html (${keywords.length} cards)`);

// Individual pages
keywords.forEach(kw => {
  const html = generateIndividualPage(kw, keywords);
  fs.writeFileSync(path.join(PRINTABLES_DIR, `${kw.slug}.html`), html);
  console.log(`Generated printables/${kw.slug}.html`);
});

// Sitemap
fs.writeFileSync(path.join(ROOT, 'sitemap.xml'), generateSitemap(keywords));
console.log(`Generated sitemap.xml (${keywords.length + 1} URLs)`);

// Remove old pages not in keywords.json
fs.readdirSync(PRINTABLES_DIR).forEach(file => {
  if (file.endsWith('.html') && file !== 'index.html') {
    const slug = file.replace('.html', '');
    if (!currentSlugs.has(slug)) {
      fs.unlinkSync(path.join(PRINTABLES_DIR, file));
      console.log(`Removed old page: ${file}`);
    }
  }
});

console.log('\nAll printables pages and sitemap generated successfully!');