import { Loader2 } from "lucide-react";
import { AnimatePresence, motion, useReducedMotion } from "motion/react";
import { Button } from "@/ui/animate-ui/components/buttons/button";
import {
  FADE_HIDDEN,
  FADE_TRANSITION,
  FADE_VISIBLE,
  PULSE,
  PULSE_TRANSITION,
  SPIN,
  SPIN_TRANSITION,
  SPINNER_HIDDEN,
  SPINNER_VISIBLE,
  SWAP_TRANSITION,
} from "@/ui/pages/auth/auth-motion";

export interface AuthSubmitButtonProps {
  /** Texto del botón: «Entrar» o «Crear cuenta». */
  label: string;
  /** Clave del texto: al cambiar (otra pestaña) el texto se funde con el nuevo. */
  labelKey: string;
  busy: boolean;
}

/**
 * Botón de envío. El indicador entra a la izquierda del texto sin moverlo (va
 * fuera del flujo) y el texto se funde al cambiar de pestaña. Al pulsar cede un
 * poco: en un botón a todo el ancho, las escalas de fábrica (1,05 / 0,95) son demasiado.
 */
export function AuthSubmitButton({ label, labelKey, busy }: AuthSubmitButtonProps) {
  const reduceMotion = useReducedMotion() === true;

  return (
    <Button
      type="submit"
      className="min-h-11 w-full"
      disabled={busy}
      aria-busy={busy}
      hoverScale={1.01}
      tapScale={0.98}
    >
      <span className="relative inline-flex items-center">
        <AnimatePresence initial={false}>
          {busy ? (
            <motion.span
              key="spinner"
              data-slot="auth-submit-spinner"
              className="absolute inset-y-0 right-full mr-2 flex items-center"
              initial={SPINNER_HIDDEN}
              animate={SPINNER_VISIBLE}
              exit={SPINNER_HIDDEN}
              transition={FADE_TRANSITION}
            >
              <motion.span
                className="flex"
                animate={reduceMotion ? PULSE : SPIN}
                transition={reduceMotion ? PULSE_TRANSITION : SPIN_TRANSITION}
              >
                <Loader2 aria-hidden="true" />
              </motion.span>
            </motion.span>
          ) : null}
        </AnimatePresence>
        <AnimatePresence mode="wait" initial={false}>
          <motion.span
            key={labelKey}
            initial={FADE_HIDDEN}
            animate={FADE_VISIBLE}
            exit={FADE_HIDDEN}
            transition={SWAP_TRANSITION}
          >
            {label}
          </motion.span>
        </AnimatePresence>
      </span>
    </Button>
  );
}
