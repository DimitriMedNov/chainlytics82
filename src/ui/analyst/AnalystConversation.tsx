import type { ChatStatus } from "@/domain/analyst/chat";
import type { AnalystIntroKind } from "@/domain/analyst/intro";
import type { AnalystMessage } from "@/domain/analyst/message";
import { motion } from "motion/react";
import { ANALYST_TEXTS } from "@/application/analyst/presentation/texts";
import { ErrorState } from "@/ui/shared";
import { AnalystIntro } from "@/ui/analyst/AnalystIntro";
import { AnalystMessageList } from "@/ui/analyst/AnalystMessageList";
import { AnalystThinking } from "@/ui/analyst/AnalystThinking";
import { RISE_HIDDEN, RISE_VISIBLE } from "@/ui/analyst/analystMotion";
import { useStickToBottom } from "@/ui/analyst/useStickToBottom";

export interface AnalystConversationProps {
  messages: readonly AnalystMessage[];
  status: ChatStatus;
  busy: boolean;
  errorMessage: string | null;
  /** Reenvía la última pregunta; sin él no hay botón de reintentar. */
  onRetry?: () => void;
  intro: AnalystIntroKind | null;
  greeting: string;
  suggestions: readonly string[];
  onSuggestion: (question: string) => void;
  /** Se llama al pulsar una acción que navega fuera del panel. */
  onNavigate: () => void;
}

/**
 * Zona con scroll del panel: la intro que toque, los mensajes, el indicador de
 * «Analizando...» y el aviso de error. Baja sola al final con cada novedad.
 */
export function AnalystConversation({
  messages,
  status,
  busy,
  errorMessage,
  onRetry,
  intro,
  greeting,
  suggestions,
  onSuggestion,
  onNavigate,
}: AnalystConversationProps) {
  const scrollRef = useStickToBottom<HTMLDivElement>(`${messages.length}:${messages.at(-1)?.content.length ?? 0}:${status}`);

  return (
    <div
      ref={scrollRef}
      role="log"
      aria-label={ANALYST_TEXTS.title}
      aria-busy={busy}
      tabIndex={0}
      data-slot="analyst-conversation"
      className="flex min-h-0 flex-1 flex-col gap-4 overflow-y-auto overflow-x-hidden p-4"
    >
      {intro ? (
        <AnalystIntro
          kind={intro}
          greeting={greeting}
          suggestions={suggestions}
          onSuggestion={onSuggestion}
          onNavigate={onNavigate}
        />
      ) : null}
      <AnalystMessageList messages={messages} />
      {status === "waiting" ? <AnalystThinking /> : null}
      {status === "error" && errorMessage ? (
        <motion.div data-slot="analyst-error" initial={RISE_HIDDEN} animate={RISE_VISIBLE}>
          <ErrorState layout="inline" title={errorMessage} onRetry={onRetry} retryLabel={ANALYST_TEXTS.retry} />
        </motion.div>
      ) : null}
    </div>
  );
}
