import { ImageResponse } from 'next/og';

// iOS / iPadOS home-screen icon. Brand palette (see tailwind.config.ts):
// black #0A0A0A, white #FAFAFA, gold #C9A84C.
// "JW" over "24" stacked, matching the browser favicon.
export const size = { width: 180, height: 180 };
export const contentType = 'image/png';

export default function AppleIcon() {
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
          letterSpacing: -4,
          background:
            'linear-gradient(135deg, #0A0A0A 0%, #161616 60%, #0A0A0A 100%)',
        }}
      >
        <span style={{ fontSize: 86, color: '#FAFAFA' }}>JW</span>
        <span style={{ fontSize: 74, color: '#C9A84C' }}>24</span>
      </div>
    ),
    { ...size }
  );
}
