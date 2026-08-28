// ===== Error Boundary Component =====
// Catches JavaScript errors in child components
//
// Developed by:
// - Arabic: م / يوسف محمود عبد الجواد
// - English: Eng / Youssef Mahmoud Abdelgawad
// - Business: https://y0ussef.com/
// - Whatsapp https://wa.me/201129334173

'use client';

import React from 'react';

interface ErrorBoundaryProps {
  children: React.ReactNode;
  fallback?: React.ReactNode;
}

interface ErrorBoundaryState {
  hasError: boolean;
  error?: Error;
}

export default class ErrorBoundary extends React.Component<ErrorBoundaryProps, ErrorBoundaryState> {
  constructor(props: ErrorBoundaryProps) {
    super(props);
    this.state = { hasError: false };
  }

  static getDerivedStateFromError(error: Error): ErrorBoundaryState {
    return { hasError: true, error };
  }

  componentDidCatch(error: Error, errorInfo: React.ErrorInfo) {
    console.error('Error caught by boundary:', error, errorInfo);
  }

  render() {
    if (this.state.hasError) {
      if (this.props.fallback) {
        return this.props.fallback;
      }

      return (
        <div className="min-h-screen flex items-center justify-center bg-gray-50">
          <div className="text-center p-8">
            <div className="text-6xl mb-4">⚠️</div>
            <h2 className="text-2xl font-bold text-gray-800 mb-4">
              {typeof window !== 'undefined' && window.location.pathname.startsWith('/en')
                ? 'Something went wrong'
                : 'حدث خطأ ما'}
            </h2>
            <p className="text-gray-600 mb-6">
              {typeof window !== 'undefined' && window.location.pathname.startsWith('/en')
                ? 'An unexpected error occurred. Please try again.'
                : 'نأسف، حدث خطأ غير متوقع. يرجى المحاولة مرة أخرى.'}
            </p>
            <button
              onClick={() => window.location.reload()}
              className="bg-purple-600 text-white px-6 py-3 rounded-lg hover:bg-purple-700 transition-colors"
            >
              {typeof window !== 'undefined' && window.location.pathname.startsWith('/en')
                ? 'Reload Page'
                : 'إعادة تحميل الصفحة'}
            </button>
          </div>
        </div>
      );
    }

    return this.props.children;
  }
}
