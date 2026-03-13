import * as React from 'react';
import { AlertTriangle, RefreshCw } from 'lucide-react';

interface Props {
  children: React.ReactNode;
}

interface State {
  hasError: boolean;
  error: Error | null;
}

export class ErrorBoundary extends React.Component<Props, State> {
  constructor(props: Props) {
    super(props);
    this.state = {
      hasError: false,
      error: null
    };
  }

  public static getDerivedStateFromError(error: Error): State {
    return { hasError: true, error };
  }

  public componentDidCatch(error: Error, errorInfo: React.ErrorInfo) {
    console.error('Uncaught error:', error, errorInfo);
  }

  public render() {
    if (this.state.hasError) {
      return (
        <div className="min-h-screen bg-[#0A0A0A] flex flex-col items-center justify-center p-6 text-center">
          <div className="bg-amber-500/10 p-6 rounded-3xl mb-6 border border-amber-500/20">
            <AlertTriangle className="w-12 h-12 text-amber-500" />
          </div>
          <h1 className="text-2xl font-black text-white mb-2">Temporary Network Interference</h1>
          <p className="text-gray-500 max-w-md mb-8">
            The Sentinel Command interface is having trouble loading. Please check your solar system's connection or try rebooting the interface. 
            <br/><br/>
            <span className="text-amber-500/80 text-xs font-bold uppercase">If this is an emergency power fault, please use the SMS Fallback on your phone.</span>
          </p>
          <div className="flex gap-4">
            <button
              onClick={() => window.location.reload()}
              className="flex items-center gap-2 bg-[#00A86B] text-white px-8 py-4 rounded-2xl font-black shadow-[0_20px_40px_rgba(0,168,107,0.3)] transition-all"
            >
              <RefreshCw className="w-4 h-4" />
              Reboot Command
            </button>
          </div>
          {process.env.NODE_ENV === 'development' && (
            <pre className="mt-8 p-4 bg-black rounded-xl text-left text-xs text-red-400 overflow-auto max-w-full border border-white/5">
              {this.state.error?.toString()}
            </pre>
          )}
        </div>
      );
    }

    return this.props.children;
  }
}
