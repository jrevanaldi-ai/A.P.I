import { ImageResponse } from 'next/og';

export const runtime = 'edge';
export const alt = 'Kiracloud API - Powerful REST API Platform';
export const size = {
  width: 1280,
  height: 640,
};
export const contentType = 'image/png';

export default async function Image() {
  return new ImageResponse(
    (
      <div
        style={{
          display: 'flex',
          width: '1280px',
          height: '640px',
          backgroundColor: '#0a0e27',
          flexDirection: 'column',
          justifyContent: 'space-between',
          padding: '60px',
          fontFamily: 'sans-serif',
          color: '#ffffff',
          position: 'relative',
        }}
      >
        {/* Main content */}
        <div style={{ position: 'relative', zIndex: 10, display: 'flex', flexDirection: 'column' }}>
          {/* Logo + Brand */}
          <div style={{ display: 'flex', alignItems: 'center', gap: '20px', marginBottom: '40px' }}>
            <svg
              width="80"
              height="80"
              viewBox="0 0 100 100"
              style={{ flexShrink: 0 }}
            >
              <rect width="100" height="100" rx="20" fill="#00bc96" />
              <text
                x="50"
                y="75"
                fontSize="70"
                fontWeight="bold"
                fill="#ffffff"
                textAnchor="middle"
                fontFamily="sans-serif"
              >
                K
              </text>
            </svg>
            <div style={{ display: 'flex', flexDirection: 'column', justifyContent: 'center' }}>
              <div
                style={{
                  fontSize: '48px',
                  fontWeight: 'bold',
                  display: 'flex',
                  alignItems: 'center',
                }}
              >
                <span>Kiracloud</span>
                <span style={{ color: '#00bc96', marginLeft: '4px', marginRight: '8px' }}>.</span>
                <span>API</span>
              </div>
              <div style={{ fontSize: '24px', color: '#a0a9c9', marginTop: '4px' }}>
                API Documentation & Tools
              </div>
            </div>
          </div>

          {/* Headline */}
          <div
            style={{
              fontSize: '76px',
              fontWeight: '900',
              lineHeight: '1.1',
              marginBottom: '24px',
              color: '#ffffff',
              letterSpacing: '-1px',
            }}
          >
            Powerful REST API
          </div>

          {/* Description */}
          <div
            style={{
              fontSize: '32px',
              color: '#a0a9c9',
              lineHeight: '1.5',
              maxWidth: '800px',
            }}
          >
            Downloaders, search tools, and system utilities in one place. Simple to integrate,
            powerful to build with.
          </div>
        </div>

        {/* Footer */}
        <div
          style={{
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center',
            paddingTop: '30px',
            borderTop: '2px solid rgba(255, 255, 255, 0.1)',
            width: '100%',
          }}
        >
          <div
            style={{
              display: 'flex',
              gap: '32px',
              fontSize: '22px',
              color: '#a0a9c9',
            }}
          >
            <div>✓ YouTube • Spotify • TikTok</div>
            <div>✓ Instagram • Lyrics Search</div>
          </div>
          <div
            style={{
              fontSize: '24px',
              color: '#00bc96',
              fontWeight: 'bold',
              letterSpacing: '1px',
            }}
          >
            api.kiracloud.me
          </div>
        </div>
      </div>
    ),
    {
      ...size,
    }
  );
}