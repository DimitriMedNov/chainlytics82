import type { ReactNode } from "react";
import { SEARCH_HINT_CLOSE, SEARCH_HINT_NAVIGATE, SEARCH_HINT_OPEN } from "@/application/search/messages";

function Key({ children }: { children: ReactNode }) {
  return (
    <kbd className="type-num rounded-xs border bg-muted px-1.5 py-0.5 font-sans text-2xs font-medium text-muted-foreground">
      {children}
    </kbd>
  );
}

/** Recordatorio de teclas. Solo desde `sm`: en táctil no hay teclado que recordar. */
export function SearchPaletteFooter() {
  return (
    <footer
      data-slot="search-hints"
      className="hidden items-center gap-4 border-t px-4 py-2 text-xs text-muted-foreground sm:flex"
    >
      <span className="flex items-center gap-1.5">
        <Key>↑</Key>
        <Key>↓</Key>
        {SEARCH_HINT_NAVIGATE}
      </span>
      <span className="flex items-center gap-1.5">
        <Key>↵</Key>
        {SEARCH_HINT_OPEN}
      </span>
      <span className="ml-auto flex items-center gap-1.5">
        <Key>Esc</Key>
        {SEARCH_HINT_CLOSE}
      </span>
    </footer>
  );
}
