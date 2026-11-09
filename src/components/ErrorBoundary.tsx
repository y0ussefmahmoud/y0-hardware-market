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
        <div className="min-h-screen flex items-center justify-center bg-surface text-on-surface">
          <div className="text-center p-8 bg-surface-container-low border border-outline-variant/30 rounded-2xl max-w-md shadow-2xl">
            <div className="w-16 h-16 rounded-2xl bg-red-950/40 border border-red-500/30 flex items-center justify-center text-red-400 text-2xl mx-auto mb-4">
              <i className="fas fa-exclamation-triangle"></i>
            </div>
            <h2 className="text-xl font-bold font-mono text-on-surface mb-3">
              {typeof window !== 'undefined' && window.location.pathname.startsWith('/en')
                ? 'CRITICAL SYSTEM FAULT'
                : 'حدث خطأ في النظام'}
            </h2>
            <p className="text-on-surface-variant font-mono text-xs mb-6">
              {typeof window !== 'undefined' && window.location.pathname.startsWith('/en')
                ? 'An unexpected error occurred during execution. Please reset the runtime.'
                : 'نأسف، حدث خطأ غير متوقع. يرجى إعادة تحميل الصفحة.'}
            </p>
            <button
              onClick={() => window.location.reload()}
              className="bg-primary-container text-on-primary-container px-6 py-2.5 rounded-lg font-mono font-bold text-xs uppercase tracking-wider hover:shadow-[0_0_20px_rgba(0,242,254,0.35)] transition-all"
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
