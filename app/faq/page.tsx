'use client';

import { useState } from 'react';

interface FAQItem {
  question: string;
  answer: string;
}

const faqs: FAQItem[] = [
  {
    question: 'What is Lune Api?',
    answer:
      'Lune Api is a free, open-source REST API that provides multiple services including media downloaders (YouTube, Spotify, TikTok, Instagram), search tools (lyrics search), and system utilities. All endpoints return JSON responses and are easy to integrate.',
  },
  {
    question: 'Do I need an API key to use these endpoints?',
    answer:
      'No, all endpoints are completely free and open. No authentication, API keys, or registration required. You can start using them immediately by making HTTP GET requests to the endpoints listed in the documentation.',
  },
  {
    question: 'What are the rate limits?',
    answer:
      'Currently, there are no strict rate limits enforced. However, we recommend using reasonable request rates (max 10-20 requests per minute) to ensure stability for all users. Excessive requests may result in temporary blocking.',
  },
  {
    question: 'Can I use these APIs in production?',
    answer:
      'While the APIs are stable and reliable, they are provided as-is without any uptime guarantee. For critical production applications, consider running your own instance or using paid alternatives with SLAs. We recommend monitoring error rates and implementing fallback mechanisms.',
  },
  {
    question: 'What file formats are supported?',
    answer:
      'YouTube and TikTok endpoints return MP4 video files and MP3 audio files. Spotify returns MP3 audio. Instagram returns media in their original format. Lyrics search returns JSON with plain text and synced lyrics (when available).',
  },
  {
    question: 'Is there a webhook or callback system?',
    answer:
      'No, the APIs use a request-response model only. All endpoints are synchronous and return results immediately. For long-running tasks, you may need to implement polling on your client side.',
  },
  {
    question: 'How can I report bugs or request features?',
    answer:
      'Please visit our GitHub repository to open an issue or start a discussion. You can also reach out via email if you find a security vulnerability. We review all feedback and appreciate contributions from the community.',
  },
  {
    question: 'Can I self-host Lune Api?',
    answer:
      'Yes! The source code is available on GitHub. You can clone the repository, install dependencies, and run your own instance. Instructions are included in the README file.',
  },
  {
    question: 'What data is collected?',
    answer:
      'We collect minimal data including request counts and response times for analytics purposes. We do not store user data, video metadata, or personal information. No tracking cookies are used.',
  },
  {
    question: 'Are there any usage restrictions?',
    answer:
      'Yes, please do not use the APIs to circumvent copyright protections, remove watermarks, or violate terms of service of third-party platforms. Use responsibly and respect intellectual property rights.',
  },
];

export default function FAQ() {
  const [expanded, setExpanded] = useState<number | null>(null);

  return (
    <main className="page-container" style={{ maxWidth: 800 }}>
      {/* Header */}
      <div style={{ marginBottom: 40 }}>
        <button
          className="btn btn-ghost"
          onClick={() => window.history.back()}
          style={{ marginBottom: 24, fontSize: 10 }}
        >
          <svg
            width="12"
            height="12"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2.5"
            strokeLinecap="round"
          >
            <polyline points="15 18 9 12 15 6" />
          </svg>
          BACK
        </button>

        <h1
          style={{
            fontFamily: 'var(--font-mono)',
            fontSize: 32,
            fontWeight: 700,
            color: 'var(--text)',
            margin: 0,
            letterSpacing: '-0.01em',
            marginBottom: 12,
          }}
        >
          FAQ
        </h1>
        <p style={{ fontFamily: 'var(--font-mono)', fontSize: 12, color: 'var(--text-muted)', margin: 0 }}>
          Frequently asked questions about Lune Api
        </p>
      </div>

      {/* FAQ Items */}
      <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
        {faqs.map((item, index) => {
          const isExpanded = expanded === index;

          return (
            <div
              key={index}
              style={{
                border: 'var(--border)',
                borderRadius: 'var(--radius)',
                background: 'var(--surface)',
                boxShadow: 'var(--shadow)',
                overflow: 'hidden',
              }}
            >
              <button
                onClick={() => setExpanded(isExpanded ? null : index)}
                style={{
                  width: '100%',
                  padding: '18px 20px',
                  background: 'transparent',
                  border: 'none',
                  cursor: 'pointer',
                  display: 'flex',
                  justifyContent: 'space-between',
                  alignItems: 'center',
                  gap: 12,
                  transition: 'all 0.2s',
                }}
                onMouseEnter={(e) => {
                  (e.currentTarget as HTMLButtonElement).style.background = 'var(--surface2)';
                }}
                onMouseLeave={(e) => {
                  (e.currentTarget as HTMLButtonElement).style.background = 'transparent';
                }}
              >
                <span
                  style={{
                    fontFamily: 'var(--font-mono)',
                    fontSize: 13,
                    fontWeight: 600,
                    color: 'var(--text)',
                    textAlign: 'left',
                  }}
                >
                  {item.question}
                </span>
                <svg
                  width="16"
                  height="16"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2.5"
                  strokeLinecap="round"
                  style={{
                    transition: 'transform 0.2s',
                    transform: isExpanded ? 'rotate(90deg)' : 'rotate(0deg)',
                    flexShrink: 0,
                  }}
                >
                  <polyline points="9 18 15 12 9 6" />
                </svg>
              </button>

              {isExpanded && (
                <div
                  style={{
                    borderTop: 'var(--border)',
                    padding: '16px 20px',
                    background: 'var(--surface2)',
                  }}
                >
                  <p
                    style={{
                      fontFamily: 'var(--font-mono)',
                      fontSize: 12,
                      lineHeight: 1.6,
                      color: 'var(--text-muted)',
                      margin: 0,
                    }}
                  >
                    {item.answer}
                  </p>
                </div>
              )}
            </div>
          );
        })}
      </div>

      {/* Footer note */}
      <div
        style={{
          marginTop: 48,
          padding: '24px',
          borderRadius: 'var(--radius)',
          background: 'var(--surface)',
          border: 'var(--border)',
          boxShadow: 'var(--shadow)',
          textAlign: 'center',
        }}
      >
        <p style={{ fontFamily: 'var(--font-mono)', fontSize: 12, color: 'var(--text-muted)', margin: 0, fontWeight: 700 }}>
          Didn&apos;t find what you&apos;re looking for?{' '}
          <span style={{ color: 'var(--text)', textDecoration: 'underline', cursor: 'pointer' }}>Check the documentation or open an issue on GitHub.</span>
        </p>
      </div>
    </main>
  );
}
