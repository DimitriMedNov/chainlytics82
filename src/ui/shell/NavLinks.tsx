import { NavLink } from "react-router-dom";
import { cn } from "@/lib/utils";
import { NAV_ITEMS } from "@/ui/shell/navigation";

export interface NavLinksProps {
  /** `bar`: en línea, solo texto. `menu`: en columna, con icono (menú móvil). */
  layout: "bar" | "menu";
  /** Se llama al pulsar un destino (el menú móvil lo usa para cerrarse). */
  onNavigate?: () => void;
  className?: string;
}

/** Los 6 destinos. `NavLink` pone `aria-current="page"` en el activo (coincidencia exacta en `/`). */
export function NavLinks({ layout, onNavigate, className }: NavLinksProps) {
  const menu = layout === "menu";

  return (
    <ul className={cn("flex", menu ? "flex-col gap-1" : "items-center gap-0.5", className)}>
      {NAV_ITEMS.map((item) => (
        <li key={item.to}>
          <NavLink
            to={item.to}
            end
            onClick={onNavigate}
            className={({ isActive }) =>
              cn(
                "relative inline-flex min-h-11 items-center gap-3 rounded-md text-sm font-medium transition-colors",
                menu ? "w-full px-3" : "px-3",
                isActive
                  ? "bg-primary/14 text-link"
                  : "text-muted-foreground hover:bg-accent hover:text-foreground",
              )
            }
          >
            {menu ? <item.icon className="size-4.5 shrink-0" aria-hidden="true" /> : null}
            {item.label}
          </NavLink>
        </li>
      ))}
    </ul>
  );
}
