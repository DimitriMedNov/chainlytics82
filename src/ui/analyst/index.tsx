import { Suspense, lazy } from "react";
import { useAnalystPanel } from "@/hooks/analyst/useAnalystPanel";
import { AnalystLauncher } from "@/ui/analyst/AnalystLauncher";

const AnalystPanel = lazy(() => import("@/ui/analyst/AnalystPanel"));

/**
 * Analista con IA: botón flotante + panel lateral. El armazón lo monta en todas
 * las rutas. El panel se descarga la primera vez que se abre y desde entonces
 * se queda montado: la conversación sobrevive a cerrarlo y a cambiar de ruta.
 */
export function AnalystMount() {
  const { open, everOpened, openPanel, setOpen, closePanel } = useAnalystPanel();

  return (
    <>
      <AnalystLauncher onOpen={openPanel} expanded={open} />
      {everOpened ? (
        <Suspense fallback={null}>
          <AnalystPanel open={open} onOpenChange={setOpen} onClose={closePanel} />
        </Suspense>
      ) : null}
    </>
  );
}
