import { Component, type ErrorInfo, type ReactNode } from "react";
import { SHELL_TEXTS } from "@/application/shared/presentation/texts";
import { ErrorState } from "@/ui/shared/error-state";
import { PageContainer } from "@/ui/shared/page";

export interface RouteErrorBoundaryProps {
  children: ReactNode;
  /** Al cambiar (la ruta), el error se olvida y se vuelve a intentar pintar. */
  resetKey: string;
  /** Se llama antes de reintentar: aquí se vuelve a pedir el código de las rutas. */
  onRetry?: () => void;
}

interface RouteErrorBoundaryState {
  error: Error | null;
}

/** ¿El fallo fue al descargar el código de la pantalla (sin red, despliegue nuevo)? */
function isDownloadError(error: Error): boolean {
  return /dynamically imported module|module script failed|Failed to fetch|error loading|ChunkLoadError/i.test(
    `${error.name} ${error.message}`,
  );
}

/**
 * Límite de errores de las rutas: si falla la descarga del código de una
 * pantalla (o la pantalla revienta al pintarse), la barra sigue en pie y aquí
 * se dice qué pasó, con «Reintentar».
 */
export class RouteErrorBoundary extends Component<RouteErrorBoundaryProps, RouteErrorBoundaryState> {
  state: RouteErrorBoundaryState = { error: null };

  static getDerivedStateFromError(error: unknown): RouteErrorBoundaryState {
    return { error: error instanceof Error ? error : new Error(String(error)) };
  }

  componentDidCatch(error: Error, info: ErrorInfo): void {
    console.error("Fallo al pintar la ruta:", error, info.componentStack);
  }

  componentDidUpdate(previous: RouteErrorBoundaryProps): void {
    if (this.state.error !== null && previous.resetKey !== this.props.resetKey) {
      this.setState({ error: null });
    }
  }

  private readonly retry = (): void => {
    this.props.onRetry?.();
    this.setState({ error: null });
  };

  render(): ReactNode {
    const { error } = this.state;
    if (error === null) return this.props.children;

    const download = isDownloadError(error);

    return (
      <PageContainer width="narrow" className="py-12">
        <ErrorState
          headingLevel="h1"
          title={download ? SHELL_TEXTS.routeError.downloadTitle : SHELL_TEXTS.routeError.crashTitle}
          message={
            download
              ? SHELL_TEXTS.routeError.downloadMessage
              : SHELL_TEXTS.routeError.crashMessage(error.message)
          }
          onRetry={this.retry}
        />
      </PageContainer>
    );
  }
}
