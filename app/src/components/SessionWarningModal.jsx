import React from 'react';

const modalStyle = {
  position: 'fixed',
  top: 0,
  left: 0,
  width: '100vw',
  height: '100vh',
  background: 'rgba(30, 58, 138, 0.18)',
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'center',
  zIndex: 9999,
};

const cardStyle = {
  background: '#fff',
  borderRadius: 18,
  boxShadow: '0 8px 32px rgba(30,58,138,0.18)',
  padding: '32px 36px',
  maxWidth: 360,
  width: '100%',
  textAlign: 'center',
  border: '2px solid #3b82f6',
  animation: 'fadeInUp 0.7s cubic-bezier(.39,.575,.565,1) both',
};

const buttonStyle = {
  marginTop: 24,
  padding: '10px 28px',
  background: 'linear-gradient(90deg, #1e3a8a 60%, #3b82f6 100%)',
  color: '#fff',
  border: 'none',
  borderRadius: 8,
  fontWeight: 700,
  fontSize: 16,
  letterSpacing: 1,
  cursor: 'pointer',
  boxShadow: '0 2px 8px rgba(30,58,138,0.10)',
  transition: 'background 0.2s, transform 0.2s',
};

const toastStyle = {
  position: 'fixed',
  bottom: 32,
  right: 32,
  background: '#1e3a8a',
  color: '#fff',
  padding: '16px 28px',
  borderRadius: 12,
  fontWeight: 600,
  fontSize: 16,
  boxShadow: '0 2px 8px rgba(30,58,138,0.13)',
  zIndex: 10000,
  animation: 'fadeInUp 0.7s cubic-bezier(.39,.575,.565,1) both',
};

const SessionWarningModal = ({ onDismiss }) => (
  <>
    <div style={modalStyle}>
      <div style={cardStyle}>
        <h2 style={{ color: '#1e3a8a', marginBottom: 12 }}>Session Expiring Soon</h2>
        <p style={{ color: '#334155', fontSize: 17, marginBottom: 8 }}>
          Your session will expire in <b>1 minute</b> due to inactivity or token expiry.<br />
          Please save your work or interact with the app to stay logged in.
        </p>
        <button style={buttonStyle} onClick={onDismiss}>Dismiss</button>
      </div>
    </div>
    <div style={toastStyle}>
      <span role="img" aria-label="warning" style={{ marginRight: 10 }}>⏰</span>
      Session will expire in 1 minute!
    </div>
    <style>{`
      @keyframes fadeInUp {
        0% { opacity: 0; transform: translateY(40px); }
        100% { opacity: 1; transform: translateY(0); }
      }
    `}</style>
  </>
);

export default SessionWarningModal; 