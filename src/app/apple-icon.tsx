import { ImageResponse } from 'next/og';

// iOS / iPadOS home-screen icon. Brand palette (see tailwind.config.ts):
// black #0A0A0A, white #FAFAFA, gold #C9A84C.
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
          background:
            'linear-gradient(135deg, #0A0A0A 0%, #161616 60%, #0A0A0A 100%)',
        }}
      >
        <div
          style={{
            display: 'flex',
            alignItems: 'baseline',
            fontWeight: 800,
            letterSpacing: -2,
          }}
        >
          <span style={{ fontSize: 58, color: '#FAFAFA' }}>JW</span>
          <span style={{ fontSize: 58, color: '#C9A84C' }}>24</span>
        </div>
      </div>
    ),
    { ...size }
  );
}
