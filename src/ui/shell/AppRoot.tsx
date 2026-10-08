import { useCallback, type ReactNode } from "react";
import { MotionConfig } from "motion/react";
import { BrowserRouter } from "react-router-dom";
import { AppProviders } from "@/app/AppProviders";
import { migratedMessage } from "@/application/sync/migrateLocalData";
import { SearchProvider } from "@/hooks/search";
import { useLocalDataSync } from "@/hooks/sync/useLocalDataSync";
import { useThemeClass } from "@/hooks/theme/useThemeClass";
import { TooltipProvider } from "@/ui/animate-ui/primitives/radix/tooltip";
import { Toaster } from "@/ui/base/sonner";
import { notify } from "@/ui/shared/notify";
import { AppLayout } from "@/ui/shell/AppLayout";

export interface VisualProvidersProps {
  children: ReactNode;
}

/**
 * Proveedor visual: pone el tema en `<html>`, sube los datos locales al iniciar
 * sesión (con su aviso), y monta tooltips y el único sistema de avisos (sonner).
 * `reducedMotion="user"`: con «reducir movimiento» activo en el sistema, Motion
 * quita desplazamientos y escalados de todos los componentes animados.
 */
function VisualProviders({ children }: VisualProvidersProps) {
  useThemeClass();

  const onMigrated = useCallback((moved: number) => {
    const { title, description } = migratedMessage(moved);
    notify.success(title, { description });
  }, []);
  useLocalDataSync(onMigrated);

  return (
    <MotionConfig reducedMotion="user">
      <TooltipProvider delayDuration={200}>
        {children}
        <Toaster position="bottom-center" closeButton />
      </TooltipProvider>
    </MotionConfig>
  );
}

/**
 * Raíz de la app nueva. Orden: datos (`AppProviders`: react-query, dependencias,
 * sesión) → visual (tema, tooltips, avisos) → buscador → router → armazón.
 */
export function AppRoot() {
  return (
    <AppProviders>
      <VisualProviders>
        <SearchProvider>
          <BrowserRouter>
            <AppLayout />
          </BrowserRouter>
        </SearchProvider>
      </VisualProviders>
    </AppProviders>
  );
}
