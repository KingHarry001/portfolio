import React from 'react';

const Loading = ({ size = 'medium' }) => {
  // Size options: 'small', 'medium', 'large'
  const sizeMap = {
    small: { loader: '100px', fontSize: '12px' },
    medium: { loader: 'clamp(120px, 25vw, 200px)', fontSize: '14px' },
    large: { loader: 'clamp(150px, 30vw, 250px)', fontSize: '16px' }
  };

  const currentSize = sizeMap[size] || sizeMap.medium;

  const styles = {
    container: {
      display: 'flex',
      justifyContent: 'center',
      alignItems: 'center',
      width: '100%',
      height: '100%',
      minHeight: '100vh',
      padding: '1rem',
      boxSizing: 'border-box'
    },
    loaderWrapper: {
      display: 'flex',
      flexDirection: 'column',
      alignItems: 'center',
      justifyContent: 'center',
      gap: '2rem'
    },
    loader: {
      height: currentSize.loader,
      width: currentSize.loader,
      position: 'relative'
    },
    box: {
      position: 'absolute',
      background: 'linear-gradient(0deg, rgba(50, 50, 50, 0.1) 0%, rgba(100, 100, 100, 0.1) 100%)',
      borderRadius: '50%',
      border: '1px solid rgba(100, 100, 100, 0.3)',
      boxShadow: '0 4px 12px rgba(0, 0, 0, 0.1)',
      backdropFilter: 'blur(4px)',
      animation: 'ripple 2s infinite ease-in-out'
    },
    logo: {
      position: 'absolute',
      top: '50%',
      left: '50%',
      transform: 'translate(-50%, -50%)',
      width: '40%',
      height: '40%'
    },
    svg: {
      width: '100%',
      height: '100%',
      fill: '#666',
      animation: 'pulse 2s infinite ease-in-out'
    },
    text: {
      fontSize: currentSize.fontSize,
      color: '#666',
      textAlign: 'center',
      fontWeight: '500',
      marginTop: '1rem'
    },
    boxPositions: [
      { inset: '0%', delay: '0.8s', opacity: 0.2 },
      { inset: '10%', delay: '0.6s', opacity: 0.3 },
      { inset: '20%', delay: '0.4s', opacity: 0.4 },
      { inset: '30%', delay: '0.2s', opacity: 0.6 },
      { inset: '40%', delay: '0s', opacity: 0.8 }
    ]
  };

  const keyframes = `
    @keyframes ripple {
      0%, 100% {
        transform: scale(1);
        opacity: 0.7;
        box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);
      }
      50% {
        transform: scale(1.2);
        opacity: 0.9;
        box-shadow: 0 8px 24px rgba(0, 0, 0, 0.15);
      }
    }
    
    @keyframes pulse {
      0%, 100% {
        opacity: 0.7;
        transform: scale(1);
      }
      50% {
        opacity: 1;
        transform: scale(1.1);
      }
    }
    
    /* Responsive adjustments */
    @media (max-width: 640px) {
      .loading-text {
        font-size: 14px;
      }
    }
    
    @media (max-width: 480px) {
      .loading-text {
        font-size: 12px;
      }
    }
  `;

  return (
    <div style={styles.container}>
      <style>{keyframes}</style>
      <div style={styles.loaderWrapper}>
        <div style={styles.loader}>
          {styles.boxPositions.map((pos, index) => (
            <div
              key={index}
              style={{
                ...styles.box,
                inset: pos.inset,
                animationDelay: pos.delay,
                opacity: pos.opacity,
                borderColor: `rgba(100, 100, 100, ${pos.opacity})`,
                zIndex: 99 - index
              }}
            />
          ))}
          <div style={styles.logo}>
            <svg viewBox="0 0 24 24" style={styles.svg}>
              <path d="M12 2L2 7l10 5 10-5-10-5zM2 17l10 5 10-5M2 12l10 5 10-5"></path>
            </svg>
          </div>
        </div>
        <div style={styles.text} className="loading-text">
          Loading...
        </div>
      </div>
    </div>
  );
};

// Responsive wrapper component that auto-adjusts
export const ResponsiveLoading = () => {
  const [size, setSize] = React.useState('medium');
  
  React.useEffect(() => {
    const handleResize = () => {
      const width = window.innerWidth;
      if (width < 480) setSize('small');
      else if (width < 768) setSize('medium');
      else setSize('large');
    };
    
    handleResize();
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);
  
  return <Loading size={size} />;
};

export default Loading;