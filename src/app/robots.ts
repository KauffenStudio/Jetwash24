import type { MetadataRoute } from 'next';
import { SITE_URL } from '@/lib/seo/business';

/** Private / non-indexable areas (locale-prefixed, e.g. /pt/admin, /en/worker). */
const DISALLOW = ['/api/', '/*/admin', '/*/worker'];

/**
 * AI retrieval and citation bots, named explicitly.
 *
 * These are ALREADY covered by the `*` rule below, so this block changes
 * nothing today — it exists so that a future tightening of the wildcard (a
 * common reflex when scrapers get noisy) cannot silently cut the site out of
 * ChatGPT, Claude and Perplexity answers. The distinction matters: these are
 * the *retrieval* agents that fetch a page in order to cite it, and they are
 * separate user-agents from the *training* crawlers (GPTBot, ClaudeBot,
 * Google-Extended). Blocking training does not block citation, and blocking
 * these does not stop training — many "block AI" guides conflate the two.
 *
 * Note that robots.txt governs crawling, not indexing, and some agents ignore
 * it outright; enforcement against those needs an edge/WAF rule, not this file.
 */
const AI_CITATION_BOTS = [
  'OAI-SearchBot', // ChatGPT search results
  'ChatGPT-User', // user-triggered fetch from ChatGPT
  'Claude-SearchBot', // Claude search results
  'Claude-User', // user-triggered fetch from Claude
  'PerplexityBot', // Perplexity index
  'Perplexity-User', // user-triggered fetch from Perplexity
];

export default function robots(): MetadataRoute.Robots {
  return {
    rules: [
      {
        userAgent: '*',
        allow: '/',
        disallow: DISALLOW,
      },
      {
        userAgent: AI_CITATION_BOTS,
        allow: '/',
        disallow: DISALLOW,
      },
    ],
    sitemap: `${SITE_URL}/sitemap.xml`,
    host: SITE_URL,
  };
}
