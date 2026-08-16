'use client';

import React, { useEffect } from 'react';
import Link from 'next/link';

export default function Error({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  useEffect(() => {
    console.error('App Error:', error);
  }, [error]);

  return (
    <div
      style={{
        minHeight: '100vh',
        backgroundColor: '#090B10',
        color: '#F3F4F6',
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        gap: '20px',
        padding: '24px',
        textAlign: 'center',
        fontFamily: 'Inter, sans-serif',
      }}
    >
      <div
        style={{
          width: '56px',
          height: '56px',
          borderRadius: '50%',
          backgroundColor: 'rgba(239, 68, 68, 0.15)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          color: '#EF4444',
          fontSize: '24px',
        }}
      >
        !
      </div>
      <h1 style={{ fontSize: '24px', fontWeight: 800, color: '#FFFFFF' }}>Something went wrong</h1>
      <p style={{ fontSize: '14px', color: '#9CA3AF', maxWidth: '400px', lineHeight: 1.5 }}>
        An unexpected error occurred. You can attempt to reload the current state or return to the studio dashboard.
      </p>
      <div style={{ display: 'flex', gap: '12px', marginTop: '8px' }}>
        <button
          type="button"
          onClick={() => reset()}
          style={{
            backgroundColor: '#3B82F6',
            color: '#FFFFFF',
            fontWeight: 600,
            padding: '10px 20px',
            borderRadius: '8px',
            cursor: 'pointer',
            border: 'none',
          }}
        >
          Try Again
        </button>
        <Link
          href="/"
          style={{
            backgroundColor: '#1F2937',
            color: '#F3F4F6',
            fontWeight: 600,
            padding: '10px 20px',
            borderRadius: '8px',
            textDecoration: 'none',
          }}
        >
          Return Home
        </Link>
      </div>
    </div>
  );
}
