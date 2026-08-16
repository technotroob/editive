import Link from 'next/link';

export default function NotFound() {
  return (
    <div
      style={{
        minHeight: '100vh',
        backgroundColor: '#090B10',
        color: '#F8FAFC',
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        gap: '16px',
        fontFamily: 'sans-serif',
      }}
    >
      <h2 style={{ fontSize: '28px', fontWeight: 800 }}>404 - Page Not Found</h2>
      <p style={{ color: '#94A3B8' }}>The requested page does not exist in EDITIVE.</p>
      <Link
        href="/"
        style={{
          backgroundColor: '#3B82F6',
          color: '#FFFFFF',
          padding: '10px 20px',
          borderRadius: '6px',
          textDecoration: 'none',
          fontWeight: 600,
        }}
      >
        Return to Home
      </Link>
    </div>
  );
}
