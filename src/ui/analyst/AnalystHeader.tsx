import { Sparkles, X } from "lucide-react";
import { ANALYST_TEXTS } from "@/application/analyst/presentation/texts";
import { SheetClose, SheetHeader, SheetTitle } from "@/ui/animate-ui/components/radix/sheet";
import { Badge } from "@/ui/base/badge";

export const ANALYST_BADGE_ID = "analyst-badge";

/** Cabecera del panel: icono, título, distintivo y el cierre propio en español. */
export function AnalystHeader() {
  return (
    <SheetHeader className="flex-row items-center gap-3 border-b p-4">
      <span className="flex size-10 shrink-0 items-center justify-center rounded-full bg-primary text-primary-foreground">
        <Sparkles className="size-5" aria-hidden="true" />
      </span>
      <div className="flex min-w-0 flex-1 flex-col items-start gap-1">
        <SheetTitle className="type-section truncate">
          {ANALYST_TEXTS.title}
        </SheetTitle>
        <Badge id={ANALYST_BADGE_ID} variant="secondary" className="max-w-full shrink">
          <span className="truncate">{ANALYST_TEXTS.badge}</span>
        </Badge>
      </div>
      <SheetClose asChild>
        <button
          type="button"
          aria-label={ANALYST_TEXTS.closeLabel}
          className="inline-flex size-11 shrink-0 items-center justify-center rounded-md text-muted-foreground transition-colors hover:bg-accent hover:text-foreground"
        >
          <X className="size-5" aria-hidden="true" />
        </button>
      </SheetClose>
    </SheetHeader>
  );
}
