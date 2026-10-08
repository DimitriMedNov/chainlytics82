import { useCallback, useEffect, useMemo, useState, type ReactNode } from "react";
import { isSearchShortcut } from "@/domain/search/shortcut";
import { SearchContext, type SearchValue } from "@/hooks/search/SearchContext";

export interface SearchProviderProps {
  children: ReactNode;
}

/**
 * Deja que cualquier parte de la app abra el buscador global y escucha el
 * atajo ⌘K / Ctrl+K en toda la ventana. Se monta una vez, en el armazón.
 */
export function SearchProvider({ children }: SearchProviderProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [wasOpened, setWasOpened] = useState(false);

  const open = useCallback(() => {
    setWasOpened(true);
    setIsOpen(true);
  }, []);
  const close = useCallback(() => setIsOpen(false), []);

  const setOpen = useCallback((next: boolean) => {
    if (next) setWasOpened(true);
    setIsOpen(next);
  }, []);

  useEffect(() => {
    // Conservado: el atajo solo abre; con la paleta ya abierta no la cierra.
    const onKeyDown = (event: KeyboardEvent) => {
      if (!isSearchShortcut(event)) return;
      event.preventDefault();
      open();
    };
    window.addEventListener("keydown", onKeyDown);
    return () => window.removeEventListener("keydown", onKeyDown);
  }, [open]);

  const value = useMemo<SearchValue>(
    () => ({ isOpen, wasOpened, open, close, setOpen }),
    [isOpen, wasOpened, open, close, setOpen],
  );

  return <SearchContext.Provider value={value}>{children}</SearchContext.Provider>;
}
