import React, { Component, ErrorInfo, ReactNode } from 'react';
import { AlertTriangle, RefreshCw } from 'lucide-react';

interface Props {
  children: ReactNode;
}

interface State {
  hasError: boolean;
  error: Error | null;
  errorInfo: ErrorInfo | null;
}

export class ErrorBoundary extends Component<Props, State> {
  public state: State = {
    hasError: false,
    error: null,
    errorInfo: null,
  };

  public static getDerivedStateFromError(error: Error): Partial<State> {
    return { hasError: true, error };
  }

  public componentDidCatch(error: Error, errorInfo: ErrorInfo) {
    console.error('Uncaught Error in Component Tree:', error, errorInfo);
    this.setState({ errorInfo });
  }

  private handleReload = () => {
    window.location.reload();
  };

  private handleReset = () => {
    try {
      localStorage.clear();
    } catch (e) {
      console.error('Failed to clear localStorage', e);
    }
    window.location.reload();
  };

  public render() {
    if (this.state.hasError) {
      return (
        <div className="min-h-screen bg-[#111315] text-[#E2E8F0] flex items-center justify-center p-4 font-sans">
          <div className="max-w-md w-full bg-[#181B1E] border border-red-500/30 rounded-2xl p-6 shadow-2xl text-center space-y-5">
            <div className="w-16 h-16 bg-red-500/10 border border-red-500/20 rounded-2xl flex items-center justify-center mx-auto text-red-400">
              <AlertTriangle className="w-8 h-8" />
            </div>

            <div className="space-y-2">
              <h1 className="text-xl font-bold text-white">Terjadi Kesalahan Aplikasi</h1>
              <p className="text-sm text-slate-400">
                Terjadi kendala runtime pada aplikasi. Anda dapat mencoba memuat ulang halaman atau mereset cache lokal.
              </p>
            </div>

            {this.state.error && (
              <div className="bg-[#111315] p-3 rounded-xl border border-white/5 text-left text-xs font-mono text-red-300 overflow-x-auto max-h-32">
                {this.state.error.toString()}
              </div>
            )}

            <div className="flex flex-col sm:flex-row items-center justify-center gap-3 pt-2">
              <button
                onClick={this.handleReload}
                className="w-full sm:w-auto px-4 py-2.5 bg-teal-500 hover:bg-teal-600 text-slate-950 font-semibold rounded-xl text-sm transition flex items-center justify-center gap-2"
              >
                <RefreshCw className="w-4 h-4" />
                Muat Ulang
              </button>
              <button
                onClick={this.handleReset}
                className="w-full sm:w-auto px-4 py-2.5 bg-slate-800 hover:bg-slate-700 text-slate-300 font-medium rounded-xl text-sm transition"
              >
                Reset Cache Local
              </button>
            </div>
          </div>
        </div>
      );
    }

    return this.props.children;
  }
}
