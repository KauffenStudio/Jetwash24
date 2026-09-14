import { ImageResponse } from 'next/og';

/**
 * The brand mark as a square image, for schema.org `logo`.
 *
 * That field used to point at /[locale]/opengraph-image — a 1200x630 share
 * card with a tagline and a CTA button baked into it, and a different URL per
 * locale, so one business entity claimed two logos. Google's logo guidelines
 * ask for a clean mark with no marketing copy, so the OG card was simply
 * ignored.
 *
 * This is the same "JW / 24" mark as the favicon (src/app/icon.tsx), drawn at
 * a size the guidelines accept, on one locale-independent URL.
 */
// Inlined rather than exported: a route handler may only export the HTTP verbs
// and a fixed set of route options, so `size`/`contentType` exports (the image
// file convention used by icon.tsx) are a type error here.
const SIZE = { width: 512, height: 512 };

export function GET() {
  return new ImageResponse(
    (
      <div
        style={{
          height: '100%',
          width: '100%',
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          justifyContent: 'center',
          lineHeight: 1,
          fontWeight: 800,
          letterSpacing: -16,
          background:
            'linear-gradient(135deg, #0A0A0A 0%, #161616 60%, #0A0A0A 100%)',
        }}
      >
        <span style={{ fontSize: 240, color: '#FAFAFA' }}>JW</span>
        <span style={{ fontSize: 208, color: '#C9A84C' }}>24</span>
      </div>
    ),
    SIZE
  );
}
