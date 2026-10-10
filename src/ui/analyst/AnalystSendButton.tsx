import type { LucideIcon } from "lucide-react";
import { Send, Square } from "lucide-react";
import { motion } from "motion/react";
import { cn } from "@/lib/utils";
import { ANALYST_TEXTS } from "@/application/analyst/presentation/texts";
import { QUICK, useAnalystMotion } from "@/ui/analyst/analystMotion";

export interface AnalystSendButtonProps {
  /** Hay una respuesta en marcha: el botón pasa a «detener». */
  busy: boolean;
  /** Se puede enviar: hay texto y no hay respuesta en marcha. */
  canSend: boolean;
  /** Corta la respuesta en curso. */
  onStop: () => void;
}

interface FaceProps {
  icon: LucideIcon;
  shown: boolean;
}

/** Una de las dos caras. Las dos están siempre montadas y se cruzan en el sitio. */
function Face({ icon: Icon, shown }: FaceProps) {
  const m = useAnalystMotion();

  return (
    <motion.span
      aria-hidden="true"
      className="absolute inset-0 flex items-center justify-center"
      initial={false}
      animate={shown ? m.faceShown : m.faceHidden}
      transition={QUICK}
    >
      <Icon className="size-4" />
    </motion.span>
  );
}

/**
 * Botón único de 44×44: «enviar» o, con una respuesta en marcha, «detener».
 * Es el mismo elemento en los dos casos (ni el foco ni el sitio cambian); solo
 * se cruzan los iconos. Sin nada que enviar es del mismo material que la barra;
 * con algo que hacer se rellena de color primario (un disco que se funde).
 * Bencho no trae botón de parar: el relevo está hecho con Motion.
 */
export function AnalystSendButton({ busy, canSend, onStop }: AnalystSendButtonProps) {
  const m = useAnalystMotion();
  const armed = busy || canSend;

  return (
    <motion.button
      type={busy ? "button" : "submit"}
      data-slot="analyst-send"
      data-armed={armed}
      aria-label={busy ? ANALYST_TEXTS.form.stopLabel : ANALYST_TEXTS.form.sendLabel}
      onClick={busy ? onStop : undefined}
      disabled={!armed}
      whileTap={m.sendTap}
      transition={QUICK}
      className={cn(
        "relative block size-11 rounded-full transition-colors duration-200 disabled:pointer-events-none",
        armed ? "text-primary-foreground" : "text-muted-foreground",
      )}
    >
      <motion.span
        aria-hidden="true"
        className="absolute inset-0 rounded-full bg-primary"
        initial={false}
        animate={{ opacity: armed ? 1 : 0 }}
        transition={QUICK}
      />
      <Face icon={Send} shown={!busy} />
      <Face icon={Square} shown={busy} />
    </motion.button>
  );
}
