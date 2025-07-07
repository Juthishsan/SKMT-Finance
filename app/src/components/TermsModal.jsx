import React from 'react';

const modalStyle = {
  position: 'fixed',
  top: 0,
  left: 0,
  width: '100vw',
  height: '100vh',
  background: 'rgba(30,58,138,0.18)',
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'center',
  zIndex: 9999,
};
const dialogStyle = {
  background: '#fff',
  borderRadius: 18,
  maxWidth: 520,
  width: '90%',
  padding: '32px 28px 24px 28px',
  boxShadow: '0 8px 32px rgba(30,58,138,0.18)',
  position: 'relative',
};
const titleStyle = {
  fontWeight: 700,
  fontSize: 22,
  color: '#1e3a8a',
  marginBottom: 18,
  textAlign: 'center',
};
const listStyle = {
  color: '#334155',
  fontSize: 16,
  marginBottom: 18,
  lineHeight: 1.7,
};
const buttonStyle = {
  width: '100%',
  padding: '12px',
  background: 'linear-gradient(90deg, #2563eb 0%, #38bdf8 100%)',
  color: '#fff',
  border: 'none',
  borderRadius: 10,
  fontWeight: 700,
  fontSize: 18,
  letterSpacing: 1,
  boxShadow: '0 2px 8px rgba(30,58,138,0.08)',
  cursor: 'pointer',
  marginTop: 10,
};
const closeStyle = {
  position: 'absolute',
  top: 12,
  right: 18,
  fontSize: 22,
  color: '#64748b',
  cursor: 'pointer',
  fontWeight: 700,
};

const TermsModal = ({ open, onAccept, onClose }) => {
  if (!open) return null;
  return (
    <div style={modalStyle}>
      <div style={dialogStyle}>
        <span style={closeStyle} onClick={onClose} title="Close">&times;</span>
        <div style={titleStyle}>Terms and Conditions</div>
        <ul style={listStyle}>
          <li>All financial services are subject to approval and verification by SKMT Finance.</li>
          <li>Personal and financial information provided must be accurate and up-to-date.</li>
          <li>Loan approvals, interest rates, and repayment terms are determined by SKMT Finance policies.</li>
          <li>Users are responsible for maintaining the confidentiality of their account credentials.</li>
          <li>SKMT Finance reserves the right to update or modify these terms at any time.</li>
        </ul>
        <button style={buttonStyle} onClick={onAccept}>I Accept the Terms</button>
      </div>
    </div>
  );
};

export default TermsModal; 