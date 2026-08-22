#!/usr/bin/env node
/**
 * Push the sitemap's URLs to IndexNow.
 *
 * IndexNow is a push protocol: instead of waiting for a crawler to notice a
 * change, the site tells participating engines directly. Bing, Yandex, Seznam
 * and Naver consume it — Google does not. It is worth running because Bing's
 * index is one of the inputs behind ChatGPT's search results.
 *
 * Ownership is proven by hosting the key as a plain-text file at the site
 * root (public/<key>.txt), so no account or API token is involved.
 *
 * Usage:  npm run seo:indexnow
 *         npm run seo:indexnow -- https://www.jetwash24.com/pt/services/gloss-polish
 *
 * With no arguments it submits every URL in the live sitemap. With arguments
 * it submits only those URLs — use that after changing a handful of pages,
 * since engines treat a full resubmit on every edit as noise.
 */

import { readdirSync } from 'node:fs';

const HOST = 'www.jetwash24.com';
const ORIGIN = `https://${HOST}`;
const ENDPOINT = 'https://api.indexnow.org/indexnow';

/** The key is whatever public/<key>.txt is named — one source of truth. */
function findKey() {
  const keyFile = readdirSync(new URL('../public', import.meta.url)).find((f) =>
    /^[0-9a-f]{32}\.txt$/.test(f)
  );
  if (!keyFile) {
    throw new Error(
      'No IndexNow key file found in public/. Create one with:\n' +
        '  KEY=$(openssl rand -hex 16) && echo -n "$KEY" > "public/$KEY.txt"'
    );
  }
  return keyFile.replace(/\.txt$/, '');
}

async function sitemapUrls() {
  const res = await fetch(`${ORIGIN}/sitemap.xml`);
  if (!res.ok) throw new Error(`sitemap.xml returned HTTP ${res.status}`);
  const xml = await res.text();
  // Only <loc> entries — <xhtml:link href> alternates repeat the same pages.
  return [...xml.matchAll(/<loc>([^<]+)<\/loc>/g)].map((m) => m[1]);
}

const key = findKey();
const explicit = process.argv.slice(2);
const urlList = explicit.length ? explicit : await sitemapUrls();

const offSite = urlList.filter((u) => !u.startsWith(ORIGIN));
if (offSite.length) {
  throw new Error(`Refusing to submit URLs outside ${ORIGIN}:\n  ${offSite.join('\n  ')}`);
}

// Verify the key file actually resolves before asking an engine to check it —
// a 404 here is the single most common reason a submission is rejected.
const keyCheck = await fetch(`${ORIGIN}/${key}.txt`);
if (!keyCheck.ok) {
  throw new Error(
    `Key file ${ORIGIN}/${key}.txt returned HTTP ${keyCheck.status}. ` +
      'Deploy it before submitting.'
  );
}

console.log(`Submitting ${urlList.length} URL(s) for ${HOST} with key ${key}…`);

const res = await fetch(ENDPOINT, {
  method: 'POST',
  headers: { 'Content-Type': 'application/json; charset=utf-8' },
  body: JSON.stringify({
    host: HOST,
    key,
    keyLocation: `${ORIGIN}/${key}.txt`,
    urlList,
  }),
});

const body = await res.text();

// 200 = accepted, 202 = accepted but key still being validated. Both are fine.
if (res.status === 200 || res.status === 202) {
  console.log(`OK — HTTP ${res.status}${body ? ` ${body}` : ''}`);
} else {
  console.error(`FAILED — HTTP ${res.status} ${body}`);
  process.exit(1);
}
