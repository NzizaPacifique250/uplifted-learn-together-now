const CommunityComingSoon: React.FC = () => (
    <div style={{
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        height: '80vh',
        textAlign: 'center',
        background: '#f5f6fa'
    }}>
        <h1 style={{ fontSize: '2.5rem', marginBottom: '1rem', color: '#2d3436' }}>
            Community Page
        </h1>
        <p style={{ fontSize: '1.25rem', color: '#636e72', marginBottom: '2rem' }}>
            We're building something awesome for our community.<br />
            Stay tuned, it's coming soon!
        </p>
        <span style={{
            fontSize: '3rem',
            color: '#00b894',
            animation: 'pulse 1.5s infinite'
        }}>
            🚧
        </span>
        <style>
            {`
                @keyframes pulse {
                    0% { transform: scale(1); }
                    50% { transform: scale(1.15); }
                    100% { transform: scale(1); }
                }
            `}
        </style>
    </div>
);

export default CommunityComingSoon;