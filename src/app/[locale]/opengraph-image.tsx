import { ImageResponse } from 'next/og';

export const alt = 'JetWash24 — Detailing Profissional no Algarve';
export const size = { width: 1200, height: 630 };
export const contentType = 'image/png';

// Brand palette (see tailwind.config.ts): black #0A0A0A, white #FAFAFA, gold #C9A84C.
export default function OpengraphImage({
  params,
}: {
  params: { locale: string };
}) {
  const isPt = params.locale !== 'en';
  const tagline = isPt
    ? 'Detailing Profissional no Algarve'
    : 'Professional Car Detailing in the Algarve';
  const sub = isPt
    ? 'Guia · Albufeira · a 3 min do Algarve Shopping'
    : 'Guia · Albufeira · 3 min from Algarve Shopping';

  return new ImageResponse(
    (
      <div
        style={{
          height: '100%',
          width: '100%',
          display: 'flex',
          flexDirection: 'column',
          justifyContent: 'center',
          padding: '90px',
          background:
            'linear-gradient(135deg, #0A0A0A 0%, #161616 55%, #0A0A0A 100%)',
        }}
      >
        <div
          style={{
            display: 'flex',
            alignItems: 'center',
            fontSize: 34,
            letterSpacing: 8,
            color: '#C9A84C',
            fontWeight: 700,
            textTransform: 'uppercase',
          }}
        >
          JetWash24
        </div>
        <div
          style={{
            marginTop: 28,
            fontSize: 76,
            lineHeight: 1.05,
            color: '#FAFAFA',
            fontWeight: 800,
            maxWidth: 980,
          }}
        >
          {tagline}
        </div>
        <div
          style={{
            marginTop: 32,
            fontSize: 32,
            color: '#A8A8A8',
          }}
        >
          {sub}
        </div>
        <div
          style={{
            marginTop: 48,
            display: 'flex',
            alignItems: 'center',
            fontSize: 30,
            color: '#0A0A0A',
            background: '#C9A84C',
            padding: '16px 36px',
            borderRadius: 999,
            fontWeight: 700,
            alignSelf: 'flex-start',
          }}
        >
          {isPt ? 'Reserva online · jetwash24.com' : 'Book online · jetwash24.com'}
        </div>
      </div>
    ),
    { ...size }
  );
}
