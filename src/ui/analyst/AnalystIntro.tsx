import { Link } from "react-router-dom";
import { CloudOff, LogIn, Sparkles } from "lucide-react";
import type { AnalystIntroKind } from "@/domain/analyst/intro";
import { ANALYST_TEXTS } from "@/application/analyst/presentation/texts";
import { Button } from "@/ui/animate-ui/components/buttons/button";
import { EmptyState } from "@/ui/shared";
import { AnalystSuggestions } from "@/ui/analyst/AnalystSuggestions";

export interface AnalystIntroProps {
  kind: AnalystIntroKind;
  /** «Hola, ana»: llega ya redactado del hook. */
  greeting: string;
  suggestions: readonly string[];
  onSuggestion: (question: string) => void;
  /** Cierra el panel al ir a iniciar sesión. */
  onNavigate: () => void;
}

/** Lo que enseña el panel cuando no hay conversación o no hay sesión. */
export function AnalystIntro({ kind, greeting, suggestions, onSuggestion, onNavigate }: AnalystIntroProps) {
  if (kind === "signin") {
    return (
      <EmptyState
        size="sm"
        headingLevel="h3"
        icon={LogIn}
        title={ANALYST_TEXTS.signin.title}
        description={ANALYST_TEXTS.signin.description}
        action={
          <Button asChild className="min-h-11">
            <Link to={ANALYST_TEXTS.signin.actionHref} onClick={onNavigate}>
              {ANALYST_TEXTS.signin.action}
            </Link>
          </Button>
        }
      />
    );
  }

  if (kind === "unavailable") {
    return (
      <EmptyState
        size="sm"
        headingLevel="h3"
        icon={CloudOff}
        title={ANALYST_TEXTS.unavailable.title}
        description={ANALYST_TEXTS.unavailable.description}
      />
    );
  }

  return (
    <div data-slot="analyst-welcome" className="flex flex-col gap-4">
      <EmptyState
        size="sm"
        framed={false}
        headingLevel="h3"
        icon={Sparkles}
        title={greeting}
        description={ANALYST_TEXTS.welcome.description}
      />
      <AnalystSuggestions suggestions={suggestions} onPick={onSuggestion} />
    </div>
  );
}
