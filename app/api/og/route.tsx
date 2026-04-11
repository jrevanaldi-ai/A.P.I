import { ImageResponse } from 'next/og';

export const runtime = 'nodejs';

export async function GET() {
  return new ImageResponse(
    (
      <div
        style={{
          display: 'flex',
          width: '1280px',
          height: '640px',
          background: 'linear-gradient(135deg, #0a0e27 0%, #1a1f3a 100%)',
          flexDirection: 'column',
          justifyContent: 'space-between',
          padding: '60px',
          fontFamily: '"Space Mono", monospace',
          color: '#fff',
          position: 'relative',
          overflow: 'hidden',
        }}
      >
        {/* Animated background elements */}
        <div
          style={{
            position: 'absolute',
            top: '-10%',
            right: '-10%',
            width: '400px',
            height: '400px',
            background: 'radial-gradient(circle, rgba(0, 188, 150, 0.15) 0%, transparent 70%)',
            borderRadius: '50%',
          }}
        />
        <div
          style={{
            position: 'absolute',
            bottom: '-15%',
            left: '-5%',
            width: '350px',
            height: '350px',
            background: 'radial-gradient(circle, rgba(0, 188, 150, 0.1) 0%, transparent 70%)',
            borderRadius: '50%',
          }}
        />

        {/* Main content */}
        <div style={{ position: 'relative', zIndex: 10 }}>
          {/* Logo + Brand */}
          <div style={{ display: 'flex', alignItems: 'center', gap: '16px', marginBottom: '40px' }}>
            {/* White K with API Reference style */}
            <svg
              width="60"
              height="60"
              viewBox="0 0 100 100"
              style={{ flexShrink: 0 }}
            >
              <text
                x="50"
                y="72"
                fontSize="80"
                fontWeight="700"
                fill="#ffffff"
                textAnchor="middle"
                fontFamily="'Courier New', 'Monaco', monospace"
                letterSpacing="-3"
              >
                K
              </text>
            </svg>
            <div>
              <div
                style={{
                  fontSize: '32px',
                  fontWeight: '700',
                  letterSpacing: '-0.5px',
                }}
              >
                Kiracloud<span style={{ color: '#00bc96' }}>.</span>API
              </div>
              <div style={{ fontSize: '14px', color: '#a0a9c9', marginTop: '4px' }}>
                API Documentation & Tools
              </div>
            </div>
          </div>

          {/* Headline */}
          <div
            style={{
              fontSize: '64px',
              fontWeight: '900',
              lineHeight: '1.2',
              marginBottom: '20px',
              background: 'linear-gradient(120deg, #fff 0%, #a0a9c9 100%)',
              backgroundClip: 'text',
              WebkitBackgroundClip: 'text',
              WebkitTextFillColor: 'transparent',
            }}
          >
            Powerful REST API
          </div>

          {/* Description */}
          <div
            style={{
              fontSize: '20px',
              color: '#a0a9c9',
              lineHeight: '1.6',
              maxWidth: '600px',
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
            position: 'relative',
            zIndex: 10,
            paddingTop: '20px',
            borderTop: '1px solid rgba(255, 255, 255, 0.1)',
          }}
        >
          <div
            style={{
              display: 'flex',
              gap: '24px',
              fontSize: '14px',
              color: '#a0a9c9',
            }}
          >
            <div>✓ YouTube • Spotify • TikTok</div>
            <div>✓ Instagram • Lyrics Search</div>
          </div>
          <div
            style={{
              fontSize: '14px',
              color: '#a0a9c9',
              letterSpacing: '0.1em',
            }}
          >
            kiracloud-api.vercel.app
          </div>
        </div>
      </div>
    ),
    {
      width: 1280,
      height: 640,
      headers: {
        'Cache-Control': 'public, s-maxage=3600, stale-while-revalidate=86400',
        'Content-Type': 'image/png',
      },
    }
  );
}
