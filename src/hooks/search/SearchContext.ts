import { createContext } from "react";

export interface SearchValue {
  /** true mientras la paleta de búsqueda está abierta. */
  isOpen: boolean;
  /** true en cuanto se abre por primera vez: sirve para montar la paleta entonces. */
  wasOpened: boolean;
  open: () => void;
  close: () => void;
  setOpen: (open: boolean) => void;
}

export const SearchContext = createContext<SearchValue>({
  isOpen: false,
  wasOpened: false,
  open: () => {},
  close: () => {},
  setOpen: () => {},
});
