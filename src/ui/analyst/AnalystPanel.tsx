import { useAnalystChat } from "@/hooks/analyst/useAnalystChat";
import { useAnalystIntro } from "@/hooks/analyst/useAnalystIntro";
import { Sheet, SheetContent } from "@/ui/animate-ui/components/radix/sheet";
import { notify, useReturnFocus } from "@/ui/shared";
import { AnalystConversation } from "@/ui/analyst/AnalystConversation";
import { AnalystForm } from "@/ui/analyst/AnalystForm";
import { AnalystHeader, ANALYST_BADGE_ID } from "@/ui/analyst/AnalystHeader";
import { useAnalystDraft } from "@/ui/analyst/useAnalystDraft";

export interface AnalystPanelProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  /** Cierra el panel desde una acción que navega fuera (iniciar sesión). */
  onClose: () => void;
}

/**
 * Panel del analista. Este componente se queda montado aunque el panel se
 * cierre (el contenido de la hoja sí se desmonta), así que la conversación y
 * el borrador viven aquí. Cerrar el panel no corta la respuesta en curso.
 */
export default function AnalystPanel({ open, onOpenChange, onClose }: AnalystPanelProps) {
  const chat = useAnalystChat({ onNotice: notify.error });
  const intro = useAnalystIntro(chat.messages.length);
  const draft = useAnalystDraft(chat.send);
  const returnFocus = useReturnFocus();

  return (
    <Sheet open={open} onOpenChange={onOpenChange}>
      <SheetContent
        side="right"
        showCloseButton={false}
        aria-describedby={ANALYST_BADGE_ID}
        onOpenAutoFocus={returnFocus.onOpenAutoFocus}
        onCloseAutoFocus={returnFocus.onCloseAutoFocus}
        // La hoja de Animate UI entra deslizándose (`x: 100%`) y no admite otra entrada por
        // props. Con «reducir movimiento» se le anula el `transform` y queda su fundido.
        className="w-full gap-0 bg-popover shadow-overlay motion-reduce:transform-none! sm:max-w-md"
      >
        <AnalystHeader />
        <AnalystConversation
          messages={chat.messages}
          status={chat.status}
          busy={chat.busy}
          errorMessage={chat.errorMessage}
          onRetry={chat.canRetry ? chat.retry : undefined}
          intro={intro.intro}
          greeting={intro.greeting}
          suggestions={intro.suggestions}
          onSuggestion={chat.send}
          onNavigate={onClose}
        />
        {intro.canAsk ? (
          <AnalystForm
            value={draft.value}
            onChange={draft.setValue}
            onSubmit={draft.submit}
            onStop={chat.stop}
            busy={chat.busy}
            canSend={draft.canSend && !chat.busy}
          />
        ) : null}
      </SheetContent>
    </Sheet>
  );
}
