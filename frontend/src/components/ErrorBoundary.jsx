import React from 'react';
import { AlertCircle, RefreshCw } from 'lucide-react';

/**
 * ErrorBoundary — catches unhandled React render errors and shows
 * a styled recovery UI instead of a white screen.
 */
export default class ErrorBoundary extends React.Component {
  constructor(props) {
    super(props);
    this.state = { hasError: false, error: null };
  }

  static getDerivedStateFromError(error) {
    return { hasError: true, error };
  }

  componentDidCatch(error, errorInfo) {
    console.error('ErrorBoundary caught:', error, errorInfo);
  }

  handleReload = () => {
    this.setState({ hasError: false, error: null });
    window.location.reload();
  };

  render() {
    if (this.state.hasError) {
      return (
        <div
          style={{
            minHeight: '100vh',
            background: '#070c18',
            backgroundImage:
              'radial-gradient(at 50% 50%, rgba(244, 63, 94, 0.1) 0px, transparent 60%)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            fontFamily: "'Inter', sans-serif",
            color: '#f8fafc',
            padding: '24px',
          }}
        >
          <div
            style={{
              maxWidth: '480px',
              width: '100%',
              background: 'rgba(15, 23, 42, 0.85)',
              backdropFilter: 'blur(16px)',
              border: '1px solid rgba(244, 63, 94, 0.3)',
              borderRadius: '20px',
              padding: '40px 32px',
              textAlign: 'center',
              boxShadow: '0 25px 60px rgba(0, 0, 0, 0.6)',
            }}
          >
            {/* Icon */}
            <div
              style={{
                width: '56px',
                height: '56px',
                borderRadius: '16px',
                background: 'rgba(244, 63, 94, 0.15)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                margin: '0 auto 20px',
              }}
            >
              <AlertCircle size={32} color="#f43f5e" />
            </div>

            <h2
              style={{
                fontSize: '1.4rem',
                fontWeight: 700,
                marginBottom: '10px',
                letterSpacing: '-0.01em',
              }}
            >
              Something Went Wrong
            </h2>

            <p
              style={{
                fontSize: '0.9rem',
                color: '#94a3b8',
                lineHeight: 1.6,
                marginBottom: '24px',
              }}
            >
              The CampusMind RAG application encountered an unexpected error.
              Your chat history has been saved and will be restored after reload.
            </p>

            {/* Error details (dev only) */}
            {this.state.error && (
              <div
                style={{
                  background: 'rgba(0,0,0,0.4)',
                  border: '1px solid rgba(255,255,255,0.1)',
                  borderRadius: '8px',
                  padding: '12px',
                  marginBottom: '24px',
                  textAlign: 'left',
                  fontSize: '0.78rem',
                  color: '#fecdd3',
                  fontFamily: 'monospace',
                  maxHeight: '100px',
                  overflow: 'auto',
                }}
              >
                {this.state.error.message || 'Unknown error'}
              </div>
            )}

            <button
              onClick={this.handleReload}
              style={{
                background: 'linear-gradient(135deg, #10b981 0%, #06b6d4 100%)',
                color: '#04111d',
                fontWeight: 600,
                border: 'none',
                padding: '12px 28px',
                borderRadius: '10px',
                cursor: 'pointer',
                display: 'inline-flex',
                alignItems: 'center',
                gap: '8px',
                fontSize: '0.95rem',
                transition: 'all 0.2s ease',
              }}
            >
              <RefreshCw size={18} />
              Reload Application
            </button>
          </div>
        </div>
      );
    }

    return this.props.children;
  }
}
