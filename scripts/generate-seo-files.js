#!/usr/bin/env node

/**
 * Generuje public/robots.txt i public/sitemap.xml
 * na podstawie zmiennej DOMAIN z pliku .env
 *
 * Uruchamiany automatycznie przed `npm run build`
 */

const fs = require("fs");
const path = require("path");

// --- Odczyt .env ---
function loadEnv() {
  const envPath = path.resolve(__dirname, "../.env");
  if (!fs.existsSync(envPath)) return {};

  return fs
    .readFileSync(envPath, "utf-8")
    .split("\n")
    .reduce((acc, line) => {
      const trimmed = line.trim();
      if (!trimmed || trimmed.startsWith("#")) return acc;
      const idx = trimmed.indexOf("=");
      if (idx === -1) return acc;
      const key = trimmed.slice(0, idx).trim();
      const value = trimmed
        .slice(idx + 1)
        .trim()
        .replace(/^["']|["']$/g, "");
      acc[key] = value;
      return acc;
    }, {});
}

// --- Main ---
const env = loadEnv();
const domain = (env.DOMAIN || process.env.DOMAIN || "").replace(/\/$/, "");

if (!domain) {
  console.warn(
    "[generate-seo-files] Brak zmiennej DOMAIN w .env – pomijam generowanie plików SEO.",
  );
  process.exit(0);
}

const today = new Date().toISOString().split("T")[0];
const publicDir = path.resolve(__dirname, "../public");

// robots.txt
const robotsTxt = `User-agent: *
Allow: /

Sitemap: ${domain}/sitemap.xml
`;

// sitemap.xml
const sitemapXml = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
  <url>
    <loc>${domain}/</loc>
    <lastmod>${today}</lastmod>
    <changefreq>weekly</changefreq>
    <priority>1.0</priority>
  </url>
</urlset>
`;

fs.writeFileSync(path.join(publicDir, "robots.txt"), robotsTxt);
fs.writeFileSync(path.join(publicDir, "sitemap.xml"), sitemapXml);

console.log(
  `[generate-seo-files] Wygenerowano pliki SEO dla domeny: ${domain}`,
);
