import { lazy, Suspense, useState } from "react";
import { Sparkles } from "lucide-react";
import { Button } from "@/components/ui/button";

/**
 * El panel del analista arrastra react-markdown, que pesa. Aquí solo vive el
 * botón flotante; el panel se descarga la primera vez que se abre.
 */
const AnalystPanel = lazy(() => import("@/components/analyst/AnalystPanel"));

export default function AICryptoAnalyst() {
  const [open, setOpen] = useState(false);
  const [everOpened, setEverOpened] = useState(false);

  const handleOpen = () => {
    setEverOpened(true);
    setOpen(true);
  };

  return (
    <>
      <Button
        size="lg"
        onClick={handleOpen}
        aria-label="Abrir el analista con IA"
        className="fixed bottom-6 right-6 z-50 h-14 w-14 rounded-full bg-gradient-to-br from-primary to-primary/70 p-0 shadow-lg transition-transform duration-300 hover:scale-110 hover:shadow-xl"
      >
        <Sparkles className="h-6 w-6 text-primary-foreground" aria-hidden="true" />
      </Button>

      {everOpened && (
        <Suspense fallback={null}>
          <AnalystPanel open={open} onOpenChange={setOpen} />
        </Suspense>
      )}
    </>
  );
}
