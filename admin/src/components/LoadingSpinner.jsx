import React from 'react';

const LoadingSpinner = ({ fullscreen = false, size = 64, text = 'Loading...' }) => (
  <div
    style={{
      position: fullscreen ? 'fixed' : 'absolute',
      top: 0,
      left: 0,
      width: '100vw',
      height: '100vh',
      background: fullscreen ? 'rgba(255,255,255,0.7)' : 'transparent',
      zIndex: 9999,
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      flexDirection: 'column',
    }}
  >
    <svg
      width={size}
      height={size}
      viewBox={`0 0 ${size} ${size}`}
      style={{ display: 'block', filter: 'drop-shadow(0 4px 16px #1e3a8a22)' }}
    >
      <defs>
        <linearGradient id="spinner-gradient" x1="0%" y1="0%" x2="100%" y2="0%">
          <stop offset="0%" stopColor="#1e3a8a" />
          <stop offset="100%" stopColor="#3b82f6" />
        </linearGradient>
      </defs>
      <circle
        cx={size/2}
        cy={size/2}
        r={size/2 - size/10}
        fill="none"
        stroke="#e5e7eb"
        strokeWidth={size/10}
      />
      <circle
        cx={size/2}
        cy={size/2}
        r={size/2 - size/10}
        fill="none"
        stroke="url(#spinner-gradient)"
        strokeWidth={size/10}
        strokeDasharray={Math.PI * (size - size/5)}
        strokeDashoffset={Math.PI * (size - size/5) * 0.25}
        strokeLinecap="round"
        style={{
          transformOrigin: '50% 50%',
          animation: 'spinner-rotate 1s linear infinite, spinner-pulse 1.2s ease-in-out infinite',
        }}
      />
    </svg>
    <div style={{ color: '#1e3a8a', fontWeight: 700, fontSize: 20, letterSpacing: 1, marginTop: 18, textShadow: '0 2px 8px #1e3a8a11' }}>{text}</div>
    <style>{`
      @keyframes spinner-rotate {
        0% { transform: rotate(0deg); }
        100% { transform: rotate(360deg); }
      }
      @keyframes spinner-pulse {
        0%, 100% { opacity: 1; }
        50% { opacity: 0.7; }
      }
    `}</style>
  </div>
);

export default LoadingSpinner; 