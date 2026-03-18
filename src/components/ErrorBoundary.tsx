import { Component, type ReactNode } from 'react'
import { AlertTriangle } from 'lucide-react'

interface Props {
  children: ReactNode
}

interface State {
  hasError: boolean
  error: Error | null
}

export class ErrorBoundary extends Component<Props, State> {
  state: State = { hasError: false, error: null }

  static getDerivedStateFromError(error: Error): State {
    return { hasError: true, error }
  }

  componentDidCatch(error: Error, info: React.ErrorInfo) {
    console.error('ErrorBoundary caught:', error, info.componentStack)
  }

  render() {
    if (this.state.hasError) {
      return (
        <div className="min-h-screen bg-dark-900 flex items-center justify-center p-4">
          <div className="glass-panel max-w-md w-full p-10 text-center rounded-[2rem]">
            <div className="inline-flex items-center justify-center w-16 h-16 rounded-full mb-6 bg-red-500/15 ring-1 ring-red-500/30">
              <AlertTriangle className="w-8 h-8 text-red-400" />
            </div>
            <h2 className="text-2xl font-bold font-mono text-red-300 mb-3">Erro Inesperado</h2>
            <p className="text-slate-400 text-sm font-sans mb-6 leading-relaxed">
              Algo deu errado na aplicação. Tente recarregar a página.
            </p>
            {this.state.error && (
              <pre className="text-xs text-slate-600 bg-dark-800 rounded-xl p-3 mb-6 text-left overflow-auto max-h-32">
                {this.state.error.message}
              </pre>
            )}
            <button
              onClick={() => window.location.reload()}
              className="btn-primary w-full h-12"
            >
              Recarregar Página
            </button>
          </div>
        </div>
      )
    }

    return this.props.children
  }
}
