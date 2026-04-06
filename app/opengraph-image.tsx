import { ImageResponse } from 'next/og'

export const alt = "L'Instantané — Album photo premium"
export const size = {
  width: 1200,
  height: 630,
}
export const contentType = 'image/png'

export default async function Image() {
  return new ImageResponse(
    (
      <div
        style={{
          width: '100%',
          height: '100%',
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          justifyContent: 'center',
          backgroundColor: '#0f172a',
          padding: '40px',
        }}
      >
        <div
          style={{
            fontSize: 72,
            fontFamily: 'serif',
            color: '#ffffff',
            letterSpacing: '-0.02em',
            marginBottom: '16px',
          }}
        >
          L&#39;Instantan&eacute;
        </div>
        <div
          style={{
            fontSize: 28,
            fontFamily: 'sans-serif',
            color: '#94a3b8',
            letterSpacing: '0.02em',
          }}
        >
          Album photo premium, livr&eacute; chez toi
        </div>
      </div>
    ),
    {
      ...size,
    }
  )
}
