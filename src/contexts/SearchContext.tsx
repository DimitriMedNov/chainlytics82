import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
  type ReactNode,
} from "react";

interface SearchCtx {
  isOpen: boolean;
  /** true en cuanto se abre por primera vez: sirve para cargarlo entonces. */
  wasOpened: boolean;
  open: () => void;
  close: () => void;
  setOpen: (open: boolean) => void;
}

const SearchContext = createContext<SearchCtx>({
  isOpen: false,
  wasOpened: false,
  open: () => {},
  close: () => {},
  setOpen: () => {},
});

/** Deja que cualquier parte de la app abra el buscador global. */
export function SearchProvider({ children }: { children: ReactNode }) {
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
    const onKeyDown = (event: KeyboardEvent) => {
      if (event.key.toLowerCase() !== "k") return;
      if (!event.metaKey && !event.ctrlKey) return;
      event.preventDefault();
      open();
    };
    window.addEventListener("keydown", onKeyDown);
    return () => window.removeEventListener("keydown", onKeyDown);
  }, [open]);

  const value = useMemo(
    () => ({ isOpen, wasOpened, open, close, setOpen }),
    [isOpen, wasOpened, open, close, setOpen],
  );

  return <SearchContext.Provider value={value}>{children}</SearchContext.Provider>;
}

// eslint-disable-next-line react-refresh/only-export-components
export const useSearch = () => useContext(SearchContext);
