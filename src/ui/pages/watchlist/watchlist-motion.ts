import { createContext, useContext, useMemo, useState } from "react";
import { useReducedMotion, type TargetAndTransition, type Transition } from "motion/react";
import type { WatchlistScreen } from "@/hooks/watchlist-screen/useWatchlistScreen";

/**
 * Movimiento de /watchlist. Un solo motor: Motion (el de Animate UI). Solo
 * `transform` y `opacity`; con «reducir movimiento» no queda ningún
 * desplazamiento ni escalado, como mucho un fundido.
 */
const EASE_OUT = [0.16, 1, 0.3, 1] as const;

/** Fundido corto: esqueleto → contenido, fila nueva, cifra que se refresca. */
export const FADE: Transition = { duration: 0.2, ease: "easeOut" };
export const HIDDEN: TargetAndTransition = { opacity: 0 };
export const VISIBLE: TargetAndTransition = { opacity: 1 };
/** Desde dónde parte una cifra recién refrescada (no desaparece: se atenúa y vuelve). */
export const REFRESHED: TargetAndTransition = { opacity: 0.35 };

export interface RowMotion {
  /** `false` con «reducir movimiento»: las filas no viajan, cambian de sitio sin recorrido. */
  travels: boolean;
  /** Recorrido de una fila al cambiar de sección o de posición. */
  transition: Transition;
  /** Salida de la fila que se quita. */
  exit: TargetAndTransition;
}

const ROW_MOTION: RowMotion = {
  travels: true,
  transition: { layout: { duration: 0.25, ease: EASE_OUT }, opacity: FADE },
  exit: { opacity: 0, scale: 0.96, transition: { duration: 0.18, ease: "easeIn" } },
};

const ROW_MOTION_REDUCED: RowMotion = {
  travels: false,
  transition: FADE,
  exit: { opacity: 0, transition: { duration: 0.15, ease: "easeIn" } },
};

export function useRowMotion(): RowMotion {
  return useReducedMotion() ? ROW_MOTION_REDUCED : ROW_MOTION;
}

export interface PanelEntrance {
  /**
   * `false` con «reducir movimiento»: el panel no se desliza a su nuevo sitio
   * cuando lo de arriba cambia de alto (ni un fotograma con `transform`).
   */
  slides: boolean;
  initial: TargetAndTransition;
  animate: TargetAndTransition;
  transition: (order: number) => Transition;
}

const PANEL_ENTRANCE: PanelEntrance = {
  slides: true,
  initial: { opacity: 0, y: 8 },
  animate: { opacity: 1, y: 0 },
  transition: (order) => ({ duration: 0.3, ease: EASE_OUT, delay: order * 0.06 }),
};

const PANEL_ENTRANCE_REDUCED: PanelEntrance = {
  slides: false,
  initial: HIDDEN,
  animate: VISIBLE,
  transition: () => FADE,
};

/** Entrada de los paneles al abrir la pantalla: suben 8 px con fundido, uno tras otro. */
export function usePanelEntrance(): PanelEntrance {
  return useReducedMotion() ? PANEL_ENTRANCE_REDUCED : PANEL_ENTRANCE;
}

export type SectionName = "favorites" | "others";
type Placement = ReadonlyMap<string, SectionName>;

export interface PlacementHistory {
  /** En qué sección está ahora cada moneda visible. */
  current: Placement;
  /** Dónde estaba en el pintado anterior. */
  previous: Placement;
}

const NOWHERE: Placement = new Map();

export const PlacementContext = createContext<PlacementHistory>({ current: NOWHERE, previous: NOWHERE });

/** Dónde está cada fila ahora y dónde estaba antes, para saber si una fila llega, viaja o es un resto. */
export function usePlacementHistory(sections: WatchlistScreen["sections"]): PlacementHistory {
  const favorites = sections.favorites.items.map((item) => item.id).join("|");
  const others = sections.others.items.map((item) => item.id).join("|");

  const current = useMemo<Placement>(() => {
    const map = new Map<string, SectionName>();
    for (const id of favorites ? favorites.split("|") : []) map.set(id, "favorites");
    for (const id of others ? others.split("|") : []) map.set(id, "others");
    return map;
  }, [favorites, others]);

  const [history, setHistory] = useState<PlacementHistory>({ current, previous: NOWHERE });
  // Estado derivado de props: se ajusta durante el render, sin efecto.
  if (history.current !== current) setHistory({ current, previous: history.current });

  return history.current === current ? history : { current, previous: history.current };
}

export interface RowPlacement {
  /** La fila ya estaba a la vista (viene de la otra sección o solo cambió de puesto): no se funde al entrar. */
  wasVisible: boolean;
  /** Es la copia vieja de una fila que ya está en la otra sección: no se enseña mientras sale. */
  isLeftover: boolean;
}

export function useRowPlacement(id: string, section: SectionName): RowPlacement {
  const { current, previous } = useContext(PlacementContext);
  const now = current.get(id);
  return { wasVisible: previous.has(id), isLeftover: now !== undefined && now !== section };
}
