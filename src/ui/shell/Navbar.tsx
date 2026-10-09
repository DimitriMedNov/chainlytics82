import { SHELL_TEXTS } from "@/application/shared/presentation/texts";
import { ThemeTogglerButton } from "@/ui/animate-ui/components/buttons/theme-toggler";
import { Logo } from "@/ui/shell/Logo";
import { MobileMenu } from "@/ui/shell/MobileMenu";
import { NavLinks } from "@/ui/shell/NavLinks";
import { SearchButton } from "@/ui/shell/SearchButton";
import { SessionArea } from "@/ui/shell/SessionArea";

/**
 * Barra de navegación fija. Orden de Tab: logo → destinos → buscador → tema →
 * sesión (o menú en pantallas estrechas).
 *  - < lg: logo, buscador (icono), tema y botón de menú (los destinos y la sesión van dentro).
 *  - ≥ lg: destinos en línea y zona de sesión; desde xl el buscador enseña texto y atajo.
 */
export function Navbar() {
  return (
    <header className="sticky top-0 z-40 w-full border-b bg-background/85 backdrop-blur-md supports-[backdrop-filter]:bg-background/70">
      <div className="mx-auto flex h-16 w-full max-w-page items-center gap-2 px-4 sm:px-6 lg:gap-4 lg:px-8">
        <Logo compact />

        <nav aria-label={SHELL_TEXTS.nav.label} className="hidden min-w-0 lg:block">
          <NavLinks layout="bar" />
        </nav>

        <div className="ml-auto flex items-center gap-1 sm:gap-2">
          <SearchButton />
          <ThemeTogglerButton
            variant="ghost"
            modes={["dark", "light", "system"]}
            className="size-11 text-muted-foreground hover:text-foreground [&_svg]:size-5"
          />
          <SessionArea className="hidden lg:inline-flex" />
          <MobileMenu className="lg:hidden" />
        </div>
      </div>
    </header>
  );
}
