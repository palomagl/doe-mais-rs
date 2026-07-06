import { Component, ReactNode } from "react";
import { AlertTriangle } from "lucide-react";

interface Props { children: ReactNode }
interface State { hasError: boolean; error?: Error }

export default class ErrorBoundary extends Component<Props, State> {
  state: State = { hasError: false };

  static getDerivedStateFromError(error: Error): State {
    return { hasError: true, error };
  }

  componentDidCatch(error: Error, info: unknown) {
    // eslint-disable-next-line no-console
    console.error("[ErrorBoundary]", error, info);
  }

  handleReload = () => {
    this.setState({ hasError: false, error: undefined });
    window.location.reload();
  };

  render() {
    if (!this.state.hasError) return this.props.children;
    return (
      <div className="min-h-screen bg-background flex flex-col items-center justify-center p-6 text-center">
        <div className="w-14 h-14 rounded-2xl bg-destructive/10 flex items-center justify-center mb-4">
          <AlertTriangle className="w-7 h-7 text-destructive" />
        </div>
        <h1 className="text-lg font-bold text-foreground mb-1">Algo deu errado</h1>
        <p className="text-sm text-muted-foreground max-w-xs mb-6">
          O aplicativo encontrou um erro inesperado. Tente recarregar.
        </p>
        <button
          onClick={this.handleReload}
          className="px-6 py-3 rounded-2xl bg-primary text-primary-foreground font-semibold active:scale-[0.98]"
        >
          Recarregar
        </button>
      </div>
    );
  }
}
