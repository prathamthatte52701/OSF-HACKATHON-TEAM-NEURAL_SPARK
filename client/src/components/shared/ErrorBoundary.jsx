import { Component } from 'react'

export default class ErrorBoundary extends Component {
  constructor(props) {
    super(props)
    this.state = { hasError: false, error: null }
  }

  static getDerivedStateFromError(error) {
    return { hasError: true, error }
  }

  componentDidCatch(error, info) {
    console.error('ErrorBoundary caught:', error, info)
  }

  render() {
    if (this.state.hasError) {
      return (
        <div style={{
          minHeight: '100vh', display: 'flex', flexDirection: 'column',
          alignItems: 'center', justifyContent: 'center',
          background: 'var(--color-bg, #0a0a0f)', fontFamily: 'Poppins, sans-serif',
          gap: 16, padding: 24, textAlign: 'center',
        }}>
          <div style={{ fontSize: 60 }}>😵</div>
          <h2 style={{ color: 'var(--color-error, #ef4444)', margin: 0, fontSize: 22 }}>Kuch galat ho gaya!</h2>
          <p style={{ color: 'var(--color-textMuted, #9ca3af)', margin: 0, fontSize: 14 }}>Something went wrong. Please refresh the page.</p>
          <button
            onClick={() => window.location.reload()}
            style={{
              marginTop: 8, background: 'var(--color-accent, #7C3AED)', color: '#fff', border: 'none',
              borderRadius: 10, padding: '10px 28px', fontSize: 15, fontWeight: 600,
              cursor: 'pointer', fontFamily: 'Poppins, sans-serif',
            }}
          >
            Refresh Page
          </button>
          {process.env.NODE_ENV === 'development' && (
            <pre style={{ color: '#ef4444', fontSize: 11, maxWidth: 600, textAlign: 'left', overflowX: 'auto' }}>
              {this.state.error?.toString()}
            </pre>
          )}
        </div>
      )
    }
    return this.props.children
  }
}
