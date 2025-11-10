import React, { Component, ReactNode } from 'react';

interface ErrorBoundaryProps {
  children: ReactNode;
  fallback?: React.ComponentType<{ error: Error; resetError: () => void }>;
}

interface ErrorBoundaryState {
  hasError: boolean;
  error: Error | null;
  errorInfo: React.ErrorInfo | null;
}

class ErrorBoundary extends Component<ErrorBoundaryProps, ErrorBoundaryState> {
  constructor(props: ErrorBoundaryProps) {
    super(props);
    this.state = {
      hasError: false,
      error: null,
      errorInfo: null,
    };
    this.resetError = this.resetError.bind(this);
  }

  static getDerivedStateFromError(error: Error): Partial<ErrorBoundaryState> {
    return {
      hasError: true,
      error,
    };
  }

  componentDidCatch(error: Error, errorInfo: React.ErrorInfo) {
    this.setState({
      errorInfo,
    });
    // In production, you would send the error to a reporting service
    console.error('Error caught by boundary:', error, errorInfo);
  }

  resetError() {
    this.setState({
      hasError: false,
      error: null,
      errorInfo: null,
    });
  }

  render() {
    if (this.state.hasError && this.state.error) {
      // Use custom fallback component if provided
      if (this.props.fallback) {
        const FallbackComponent = this.props.fallback;
        return <FallbackComponent error={this.state.error} resetError={this.resetError} />;
      }

      // Default error UI
      return (
        <div className="min-h-screen flex items-center justify-center bg-gray-50 px-4">
          <div className="max-w-lg w-full bg-white rounded-xl shadow-lg p-8 text-center">
            <div className="text-6xl mb-6">😵</div>
            <h2 className="text-2xl font-bold text-gray-900 mb-4">
              Oops! Something went wrong
            </h2>
            <p className="text-gray-600 mb-6 leading-relaxed">
              We're sorry, but something unexpected happened. Our team has been notified and is working to fix this issue.
            </p>

            <div className="space-y-3">
              <button
                onClick={this.resetError}
                className="w-full bg-primary text-white px-6 py-3 rounded-lg hover:bg-primary-dark transition-colors font-medium"
              >
                Try Again
              </button>

              <button
                onClick={() => window.location.href = '/'}
                className="w-full bg-gray-100 text-gray-700 px-6 py-3 rounded-lg hover:bg-gray-200 transition-colors font-medium"
              >
                Go Home
              </button>
            </div>

            {process.env.NODE_ENV === 'development' && this.state.error && (
              <details className="mt-6 text-left">
                <summary className="cursor-pointer text-sm text-gray-500 hover:text-gray-700">
                  Error Details (Development Only)
                </summary>
                <div className="mt-3 p-4 bg-gray-100 rounded-lg text-xs font-mono text-left overflow-auto max-h-40">
                  <div className="font-semibold text-red-600 mb-2">Error:</div>
                  <div className="text-gray-800 mb-3">{this.state.error.toString()}</div>

                  {this.state.errorInfo && (
                    <>
                      <div className="font-semibold text-red-600 mb-2">Component Stack:</div>
                      <pre className="text-gray-700 whitespace-pre-wrap">
                        {this.state.errorInfo.componentStack}
                      </pre>
                    </>
                  )}
                </div>
              </details>
            )}
          </div>
        </div>
      );
    }

    return this.props.children;
  }
}

export default ErrorBoundary;