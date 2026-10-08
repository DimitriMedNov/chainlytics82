import { useMemo } from "react";
import { useDeps } from "@/app/deps";
import type { ShortcutHint } from "@/application/search/useCases";

/** Cómo enseñar el atajo del buscador en este equipo: «⌘K» o «Ctrl K». */
export function useSearchShortcutHint(): ShortcutHint {
  const { search } = useDeps();
  return useMemo(() => search.getShortcutHint(), [search]);
}
