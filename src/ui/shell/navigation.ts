import {
  ArrowLeftRight,
  ChartCandlestick,
  GitCompareArrows,
  LayoutDashboard,
  Star,
  Wallet,
  type LucideIcon,
} from "lucide-react";
import { SHELL_TEXTS } from "@/application/shared/presentation/texts";

export interface NavItem {
  to: string;
  label: string;
  icon: LucideIcon;
}

/** Los 6 destinos de la barra, en su orden de siempre. */
export const NAV_ITEMS: readonly NavItem[] = [
  { to: "/", label: SHELL_TEXTS.nav.items.panel, icon: LayoutDashboard },
  { to: "/markets", label: SHELL_TEXTS.nav.items.markets, icon: ChartCandlestick },
  { to: "/portfolio", label: SHELL_TEXTS.nav.items.portfolio, icon: Wallet },
  { to: "/comparar", label: SHELL_TEXTS.nav.items.compare, icon: GitCompareArrows },
  { to: "/watchlist", label: SHELL_TEXTS.nav.items.watchlist, icon: Star },
  { to: "/converter", label: SHELL_TEXTS.nav.items.converter, icon: ArrowLeftRight },
];

/** Id del `<main>`: destino del enlace «Saltar al contenido». */
export const MAIN_CONTENT_ID = "contenido";
