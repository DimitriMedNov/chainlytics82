import { useCallback, useState } from "react";
import { Menu, X } from "lucide-react";
import { Link } from "react-router-dom";
import { SHELL_TEXTS } from "@/application/shared/presentation/texts";
import { useSession } from "@/hooks/session/useSession";
import { cn } from "@/lib/utils";
import { Button } from "@/ui/animate-ui/components/buttons/button";
import {
  Sheet,
  SheetClose,
  SheetContent,
  SheetDescription,
  SheetFooter,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/ui/animate-ui/components/radix/sheet";
import { LogIn } from "@/ui/animate-ui/icons/log-in";
import { LogOut } from "@/ui/animate-ui/icons/log-out";
import { Logo } from "@/ui/shell/Logo";
import { NavLinks } from "@/ui/shell/NavLinks";
import { Skeleton } from "@/ui/shared/skeletons";
import { NO_EMAIL_LABEL } from "@/ui/shell/SessionArea";
import { useSignOut } from "@/ui/shell/useSignOut";

export interface MobileMenuProps {
  className?: string;
}

const ICON_BUTTON =
  "inline-flex size-11 shrink-0 items-center justify-center rounded-md text-muted-foreground transition-colors hover:bg-accent hover:text-foreground";

/**
 * Menú de navegación para pantallas estrechas: hoja lateral con los 6 destinos
 * y la sesión (aquí SÍ se ve el correo). Escape la cierra y el foco vuelve al
 * botón que la abrió (lo hace Radix).
 */
export function MobileMenu({ className }: MobileMenuProps) {
  const [open, setOpen] = useState(false);
  const close = useCallback(() => setOpen(false), []);
  const { access, user } = useSession();
  const { signOut, isSigningOut } = useSignOut(close);

  return (
    <Sheet open={open} onOpenChange={setOpen}>
      <SheetTrigger asChild>
        <button type="button" aria-label={SHELL_TEXTS.mobileMenu.open} className={cn(ICON_BUTTON, className)}>
          <Menu className="size-5" aria-hidden="true" />
        </button>
      </SheetTrigger>
      <SheetContent side="right" showCloseButton={false} className="w-80 max-w-5/6 gap-0 bg-popover">
        <SheetHeader className="flex-row items-center justify-between border-b px-4 py-2.5">
          <Logo onNavigate={close} />
          <SheetTitle className="sr-only">{SHELL_TEXTS.mobileMenu.title}</SheetTitle>
          <SheetDescription className="sr-only">{SHELL_TEXTS.mobileMenu.description}</SheetDescription>
          <SheetClose asChild>
            <button type="button" aria-label={SHELL_TEXTS.mobileMenu.close} className={ICON_BUTTON}>
              <X className="size-5" aria-hidden="true" />
            </button>
          </SheetClose>
        </SheetHeader>

        <nav aria-label={SHELL_TEXTS.mobileMenu.navLabel} className="flex-1 overflow-y-auto p-3">
          <NavLinks layout="menu" onNavigate={close} />
        </nav>

        {access.kind === "unavailable" ? null : (
          <SheetFooter className="border-t">
            {access.kind === "checking" ? (
              <div role="status">
                <span className="sr-only">{SHELL_TEXTS.session.checking}</span>
                <Skeleton className="h-11 w-full" aria-hidden="true" />
              </div>
            ) : null}
            {access.kind === "signed-in" ? (
              <>
                <p className="flex min-w-0 flex-col gap-0.5">
                  <span className="type-eyebrow text-muted-foreground">{SHELL_TEXTS.session.signedInEyebrow}</span>
                  <span className="truncate text-sm font-medium text-foreground">
                    {user?.email ?? NO_EMAIL_LABEL}
                  </span>
                </p>
                <Button
                  type="button"
                  variant="outline"
                  className="min-h-11 w-full"
                  disabled={isSigningOut}
                  onClick={() => void signOut()}
                >
                  <LogOut aria-hidden="true" />
                  {isSigningOut ? SHELL_TEXTS.session.signingOut : SHELL_TEXTS.session.signOut}
                </Button>
              </>
            ) : null}
            {access.kind === "signed-out" ? (
              <Button asChild className="min-h-11 w-full">
                <Link to="/auth" onClick={close}>
                  <LogIn aria-hidden="true" />
                  {SHELL_TEXTS.session.signIn}
                </Link>
              </Button>
            ) : null}
          </SheetFooter>
        )}
      </SheetContent>
    </Sheet>
  );
}
