import {
  ArrowLeftRight,
  ChartCandlestick,
  GitCompareArrows,
  LayoutDashboard,
  Star,
  Wallet,
  type LucideIcon,
} from "lucide-react";

export interface NavItem {
  to: string;
  label: string;
  icon: LucideIcon;
}

/** Los 6 destinos de la barra, en su orden de siempre. */
export const NAV_ITEMS: readonly NavItem[] = [
  { to: "/", label: "Panel", icon: LayoutDashboard },
  { to: "/markets", label: "Mercados", icon: ChartCandlestick },
  { to: "/portfolio", label: "Portfolio", icon: Wallet },
  { to: "/comparar", label: "Comparar", icon: GitCompareArrows },
  { to: "/watchlist", label: "Watchlist", icon: Star },
  { to: "/converter", label: "Convertidor", icon: ArrowLeftRight },
];

/** Id del `<main>`: destino del enlace «Saltar al contenido». */
export const MAIN_CONTENT_ID = "contenido";
