import { useState, type FocusEvent, type FormEvent } from "react";
import { useReducedMotion } from "motion/react";
import { cn } from "@/lib/utils";
import { ANALYST_TEXTS } from "@/application/analyst/presentation/texts";
import { AnalystFormBar } from "@/ui/analyst/AnalystFormBar";
import { AnalystSendButton } from "@/ui/analyst/AnalystSendButton";
import { useRefocusWhenIdle } from "@/ui/analyst/useRefocusWhenIdle";
import { useLiquidOutOfTabOrder } from "@/ui/analyst/useLiquidOutOfTabOrder";

const INPUT_ID = "analyst-input";

export interface AnalystFormProps {
  value: string;
  onChange: (value: string) => void;
  /** Envía el borrador (Enter o el botón). */
  onSubmit: () => void;
  /** Corta la respuesta en curso. */
  onStop: () => void;
  /** Hay una respuesta en marcha: el campo se deshabilita y el botón pasa a «detener». */
  busy: boolean;
  /** Se puede enviar: hay texto y no hay respuesta en marcha. */
  canSend: boolean;
}

/**
 * Barra de pregunta (bloque «Command» de Bencho, con `liquid-gooey`): la barra
 * y el botón son dos cuerpos del mismo líquido. En reposo el botón está fundido
 * en el extremo de la barra; al entrar en el campo, al escribir o con una
 * respuesta en marcha se separa de ella. La barra no se mueve ni cambia de
 * ancho: solo se desplaza el botón (`transform`). Con «reducir movimiento» el
 * botón está siempre separado y no se desplaza nunca.
 */
export function AnalystForm({ value, onChange, onSubmit, onStop, busy, canSend }: AnalystFormProps) {
  const inputRef = useRefocusWhenIdle(busy);
  const formRef = useLiquidOutOfTabOrder<HTMLFormElement>();
  const [focused, setFocused] = useState(false);
  const reduced = useReducedMotion() === true;
  const split = reduced || focused || busy || canSend;

  const handleSubmit = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    if (canSend) onSubmit();
  };

  const handleBlur = (event: FocusEvent<HTMLFormElement>) => {
    if (!event.currentTarget.contains(event.relatedTarget)) setFocused(false);
  };

  return (
    <form
      ref={formRef}
      onSubmit={handleSubmit}
      onFocus={() => setFocused(true)}
      onBlur={handleBlur}
      data-slot="analyst-form"
      data-split={split}
      className="border-t p-4"
    >
      <AnalystFormBar
        split={split}
        still={reduced}
        field={
          <label
            htmlFor={INPUT_ID}
            // El contorno de foco lo dibuja la barra entera (píldora), no el campo de dentro.
            className="flex h-11 cursor-text items-center rounded-full pl-4 pr-2 has-[:focus-visible]:outline-2 has-[:focus-visible]:outline-offset-2 has-[:focus-visible]:outline-ring"
          >
            <span className="sr-only">{ANALYST_TEXTS.form.inputLabel}</span>
            <input
              ref={inputRef}
              id={INPUT_ID}
              type="text"
              value={value}
              onChange={(event) => onChange(event.target.value)}
              placeholder={ANALYST_TEXTS.form.inputPlaceholder}
              disabled={busy}
              autoComplete="off"
              enterKeyHint="send"
              className={cn(
                "h-full min-w-0 flex-1 bg-transparent text-base text-foreground outline-none! sm:text-sm",
                "placeholder:text-muted-foreground disabled:cursor-not-allowed disabled:opacity-50",
                // En reposo el botón tapa el extremo de la barra: el texto de ayuda se corta antes.
                !split && "pr-11",
              )}
            />
          </label>
        }
        button={<AnalystSendButton busy={busy} canSend={canSend} onStop={onStop} />}
      />
    </form>
  );
}
