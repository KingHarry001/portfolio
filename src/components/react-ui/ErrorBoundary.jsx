// components/react-ui/ErrorBoundary.jsx
import React from 'react';

class ErrorBoundary extends React.Component {
  constructor(props) {
    super(props);
    this.state = { hasError: false, error: null, errorInfo: null };
  }

  static getDerivedStateFromError(error) {
    return { hasError: true };
  }

  componentDidCatch(error, errorInfo) {
    this.setState({
      error: error,
      errorInfo: errorInfo
    });
    
    // You can log the error to an error reporting service here
    console.error('ErrorBoundary caught an error:', error, errorInfo);
  }

  render() {
    if (this.state.hasError) {
      return (
        <div className="min-h-screen flex flex-col items-center justify-center bg-gradient-to-br from-black to-gray-900 p-6">
          <div className="max-w-md text-center space-y-6">
            <div className="p-4 bg-red-500/10 border border-red-500/20 rounded-2xl">
              <h2 className="text-2xl font-bold text-red-400 mb-2">Something went wrong</h2>
              <p className="text-gray-400">
                An unexpected error occurred. Please try refreshing the page.
              </p>
            </div>
            
            {this.state.error && (
              <div className="text-left p-4 bg-gray-900/50 rounded-lg border border-gray-700">
                <p className="text-sm text-gray-500 mb-2">Error details:</p>
                <code className="text-xs text-red-400">
                  {this.state.error.toString()}
                </code>
              </div>
            )}

            <div className="flex gap-4">
              <button
                onClick={() => window.location.reload()}
                className="flex-1 px-4 py-2 bg-gradient-to-r from-cyan-500 to-blue-500 text-white rounded-lg font-medium hover:opacity-90 transition-opacity"
              >
                Refresh Page
              </button>
              <button
                onClick={() => window.location.href = '/'}
                className="flex-1 px-4 py-2 bg-gray-800 text-white rounded-lg font-medium hover:bg-gray-700 transition-colors"
              >
                Go Home
              </button>
            </div>
          </div>
        </div>
      );
    }

    return this.props.children;
  }
}

export default ErrorBoundary;