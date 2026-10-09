import { useCallback, useEffect, useLayoutEffect, useMemo, useRef, useState, type RefObject } from "react";
import type { WatchlistCoin } from "@/domain/watchlist/entries";
import type { WatchlistScreen } from "@/hooks/watchlist-screen/useWatchlistScreen";
import type { WatchlistRowHandlers } from "@/ui/pages/watchlist/use-watchlist-row-actions";

/** La fila que el usuario acaba de marcar como favorita (para el rebote de la estrella). */
export interface FavoriteCelebration {
  id: string;
  beat: number;
}

type PendingFocus =
  | { action: "favorite"; at: number; rowId: string; wasFavorite: boolean }
  | { action: "remove"; at: number; rowId: string; neighborId: string | null };

/** Lo que dura la confirmación de la estrella. */
const CELEBRATION_MS = 700;
/** Si la lista no cambia en este tiempo (el guardado falló), ya no se mueve el foco. */
const FOCUS_WINDOW_MS = 4000;
const LIVE_ROW = '[data-slot="watchlist-row"]:not([inert])';
const FIRST_CONTROL = "a[href], button:not([disabled]), input:not([disabled])";

function liveRow(region: HTMLElement, rowId: string): HTMLElement | null {
  return region.querySelector<HTMLElement>(`${LIVE_ROW}[data-row-id="${CSS.escape(rowId)}"]`);
}

/** La fila siguiente a la que se quita; si era la última, la anterior. */
function neighborOf(region: HTMLElement | null, rowId: string): string | null {
  if (!region) return null;
  const ids = Array.from(region.querySelectorAll<HTMLElement>(LIVE_ROW), (row) => row.dataset.rowId ?? "");
  const position = ids.indexOf(rowId);
  if (position === -1) return null;
  return ids[position + 1] ?? ids[position - 1] ?? null;
}

function firstControl(region: HTMLElement): HTMLElement | null {
  const controls = Array.from(region.querySelectorAll<HTMLElement>(FIRST_CONTROL));
  return controls.find((control) => !control.closest("[inert]")) ?? null;
}

/** Tras «Limpiar búsqueda» el botón desaparece: el foco vuelve al campo de búsqueda. */
export function focusWatchlistSearch(): void {
  document.querySelector<HTMLElement>('[data-slot="watchlist-toolbar"] input')?.focus();
}

export interface WatchlistRowFeedback {
  /** Va en el contenedor de la lista: dentro de él se busca a quién dar el foco. */
  regionRef: RefObject<HTMLDivElement | null>;
  /** Las mismas acciones, que además recuerdan dónde debe quedar el foco. */
  handlers: WatchlistRowHandlers;
  celebration: FavoriteCelebration | null;
}

/**
 * Respuesta de la lista a las acciones de una fila, sin cambiar lo que hacen:
 * - Al marcar favorita, la fila cambia de sección (su botón se vuelve a crear):
 *   el foco sigue a la estrella de esa fila y la estrella rebota una vez.
 * - Al quitar una fila, el foco pasa a «quitar» de la fila vecina; si no queda
 *   ninguna, al primer control útil (búsqueda o la acción del estado vacío).
 */
export function useWatchlistRowFeedback(
  handlers: WatchlistRowHandlers,
  sections: WatchlistScreen["sections"],
  stateKind: WatchlistScreen["state"]["kind"],
): WatchlistRowFeedback {
  const regionRef = useRef<HTMLDivElement>(null);
  const pending = useRef<PendingFocus | null>(null);
  const [celebration, setCelebration] = useState<FavoriteCelebration | null>(null);

  const favoriteIds = sections.favorites.items.map((item) => item.id).join("|");
  const otherIds = sections.others.items.map((item) => item.id).join("|");

  useEffect(() => {
    if (!celebration) return;
    const timer = window.setTimeout(() => setCelebration(null), CELEBRATION_MS);
    return () => window.clearTimeout(timer);
  }, [celebration]);

  // Después de cada cambio de la lista: si hay un foco pendiente, se coloca.
  useLayoutEffect(() => {
    const wanted = pending.current;
    const region = regionRef.current;
    if (!wanted || !region) return;
    if (performance.now() - wanted.at > FOCUS_WINDOW_MS) {
      pending.current = null;
      return;
    }
    const active = document.activeElement;
    const focusIsFree = !active || active === document.body || region.contains(active);
    const row = liveRow(region, wanted.rowId);

    if (wanted.action === "favorite") {
      if (!row || row.dataset.favorite === String(wanted.wasFavorite)) return;
      if (focusIsFree) row.querySelector<HTMLElement>('[data-action="favorite"]')?.focus();
    } else {
      if (row) return;
      const neighbor = wanted.neighborId ? liveRow(region, wanted.neighborId) : null;
      const target = neighbor?.querySelector<HTMLElement>('[data-action="remove"]') ?? firstControl(region);
      if (focusIsFree) target?.focus();
    }
    pending.current = null;
  }, [favoriteIds, otherIds, stateKind]);

  const { onToggleFavorite: toggleFavorite, onRemove: remove } = handlers;

  const onToggleFavorite = useCallback(
    (item: WatchlistCoin) => {
      pending.current = {
        action: "favorite",
        at: performance.now(),
        rowId: item.id,
        wasFavorite: item.isFavorite,
      };
      setCelebration((last) => (item.isFavorite ? null : { id: item.id, beat: (last?.beat ?? 0) + 1 }));
      toggleFavorite(item);
    },
    [toggleFavorite],
  );

  const onRemove = useCallback(
    (item: WatchlistCoin) => {
      pending.current = {
        action: "remove",
        at: performance.now(),
        rowId: item.id,
        neighborId: neighborOf(regionRef.current, item.id),
      };
      remove(item);
    },
    [remove],
  );

  const wrapped = useMemo(
    () => ({ ...handlers, onToggleFavorite, onRemove }),
    [handlers, onToggleFavorite, onRemove],
  );

  return { regionRef, handlers: wrapped, celebration };
}
