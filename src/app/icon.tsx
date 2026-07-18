import { ImageResponse } from 'next/og';

// Browser favicon. Brand palette (see tailwind.config.ts):
// black #0A0A0A, white #FAFAFA, gold #C9A84C.
// "JW" over "24" stacked so it stays legible and centred at 32px.
export const size = { width: 32, height: 32 };
export const contentType = 'image/png';

export default function Icon() {
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
          letterSpacing: -1,
          background:
            'linear-gradient(135deg, #0A0A0A 0%, #161616 60%, #0A0A0A 100%)',
          borderRadius: 6,
        }}
      >
        <span style={{ fontSize: 15, color: '#FAFAFA' }}>JW</span>
        <span style={{ fontSize: 13, color: '#C9A84C' }}>24</span>
      </div>
    ),
    { ...size }
  );
}
