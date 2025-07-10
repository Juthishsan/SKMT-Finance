import React from 'react';

const maintenanceStyles = {
    minHeight: '100vh',
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    justifyContent: 'center',
    background: 'linear-gradient(135deg, #f8fafc 0%, #e0e7ff 100%)',
    color: '#22223b',
    fontFamily: 'Segoe UI, Arial, sans-serif',
    textAlign: 'center',
    padding: '0 1rem',
};

const iconStyles = {
    fontSize: '6rem',
    marginBottom: '1rem',
    animation: 'spin 2s linear infinite',
};

const headingStyles = {
    fontSize: '2.5rem',
    fontWeight: 700,
    marginBottom: '1rem',
    letterSpacing: '1px',
};

const subheadingStyles = {
    fontSize: '1.25rem',
    marginBottom: '2rem',
    color: '#4f4f6e',
};

const pulseKeyframes = `
@keyframes spin {
  0% { transform: rotate(0deg); }
  100% { transform: rotate(360deg); }
}
`;

const UnderMaintanance = () => (
    <div style={maintenanceStyles}>
        <style>{pulseKeyframes}</style>
        <div style={iconStyles} role="img" aria-label="Maintenance">
            🛠️
        </div>
        <h1 style={headingStyles}>We'll Be Back Soon!</h1>
        <p style={subheadingStyles}>
            Our website is currently undergoing scheduled maintenance.<br />
            We appreciate your patience and understanding.<br />
            Please check back later!
        </p>
        <div style={{ marginTop: '2rem', fontSize: '1rem', color: '#7c7c9a' }}>
            &mdash; SKMT Finance Team
        </div>
    </div>
);
export default UnderMaintanance;