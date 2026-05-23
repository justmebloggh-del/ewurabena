'use client';

import Link from 'next/link';
import { useEffect } from 'react';

export default function Error({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  useEffect(() => {
    console.error(error);
  }, [error]);

  return (
    <section
      style={{
        minHeight: '60vh',
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        padding: '4rem 2rem',
        textAlign: 'center',
        background: 'var(--ivory)',
      }}
    >
      <p className="gold-label" style={{ marginBottom: '1rem' }}>Something went wrong</p>
      <h1
        style={{
          fontFamily: 'var(--font-heading), serif',
          fontSize: 'clamp(2rem, 4vw, 2.8rem)',
          fontWeight: 300,
          color: 'var(--kente-green)',
          marginBottom: '1rem',
        }}
      >
        We&apos;ll be right back
      </h1>
      <p style={{ color: 'var(--text-dark-muted)', marginBottom: '2rem', maxWidth: '480px', lineHeight: 1.7 }}>
        A temporary error occurred. Please try again or return to the homepage.
      </p>
      <div style={{ display: 'flex', gap: '1rem', flexWrap: 'wrap', justifyContent: 'center' }}>
        <button onClick={reset} className="btn-primary">Try Again</button>
        <Link href="/" className="btn-secondary">Go Home</Link>
      </div>
    </section>
  );
}
