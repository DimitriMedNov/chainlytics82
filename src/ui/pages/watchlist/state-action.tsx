import { Link } from "react-router-dom";
import type {
  NavigateEmptyScreenState,
  NoMatchesScreenState,
} from "@/hooks/watchlist-screen/screenState";
import { Button } from "@/ui/animate-ui/components/buttons/button";
import { focusWatchlistSearch } from "@/ui/pages/watchlist/use-watchlist-row-feedback";

export interface StateActionProps {
  state: NavigateEmptyScreenState | NoMatchesScreenState;
}

/** La salida de un vacío: ir a otra ruta («Explorar mercados») o limpiar la búsqueda. */
export function StateAction({ state }: StateActionProps) {
  if (state.kind === "no-matches") {
    // El botón desaparece al limpiar: el foco vuelve al campo de búsqueda.
    const clear = () => {
      state.onAction();
      focusWatchlistSearch();
    };
    return (
      <Button type="button" variant="outline" onClick={clear} className="min-h-11">
        {state.actionLabel}
      </Button>
    );
  }
  return (
    <Button asChild className="min-h-11">
      <Link to={state.actionTo}>{state.actionLabel}</Link>
    </Button>
  );
}
