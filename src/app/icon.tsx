import { ImageResponse } from 'next/og';

// Browser favicon. Brand palette (see tailwind.config.ts):
// black #0A0A0A, white #FAFAFA, gold #C9A84C.
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
          alignItems: 'baseline',
          justifyContent: 'center',
          fontSize: 15,
          fontWeight: 800,
          letterSpacing: -0.5,
          background:
            'linear-gradient(135deg, #0A0A0A 0%, #161616 60%, #0A0A0A 100%)',
          borderRadius: 7,
        }}
      >
        <span style={{ color: '#FAFAFA' }}>JW</span>
        <span style={{ color: '#C9A84C' }}>24</span>
      </div>
    ),
    { ...size }
  );
}
