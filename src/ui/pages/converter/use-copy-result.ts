import { useCallback } from "react";
import type { ConverterForm } from "@/hooks/converter/useConverterForm";
import { notify } from "@/ui/shared";

/** Copia el resultado; si el portapapeles falla, enseña el aviso de error que devuelve el hook. */
export function useCopyResult(copy: ConverterForm["copy"]): () => void {
  return useCallback(() => {
    void copy().then((outcome) => {
      if (!outcome.ok) notify.error(outcome.error.title, { description: outcome.error.description });
    });
  }, [copy]);
}
