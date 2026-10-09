import type { ReactNode } from "react";
import { motion } from "motion/react";
import { cn } from "@/lib/utils";
import { FRAME_HIDDEN, FRAME_TRANSITION, FRAME_VISIBLE } from "@/ui/pages/auth/auth-motion";

export interface AuthFrameProps {
  className?: string;
  children: ReactNode;
}

/**
 * Marco de la tarjeta de acceso: un borde ancho atenuado con la tarjeta dentro.
 * Es UNO para el esqueleto y el formulario: entra una vez y, al terminar la
 * comprobación de sesión, solo cambia lo de dentro (sin salto). Si un error la
 * hace crecer, el alto no cambia de golpe: se ajusta con `transform` (`layout`).
 */
export function AuthFrame({ className, children }: AuthFrameProps) {
  return (
    <motion.div
      data-slot="auth-frame"
      layout
      initial={FRAME_HIDDEN}
      animate={FRAME_VISIBLE}
      transition={FRAME_TRANSITION}
      className={cn("w-full max-w-md rounded-xl border bg-muted p-2", className)}
    >
      <motion.div layout transition={FRAME_TRANSITION} className="rounded-lg bg-card px-4 py-6 shadow-card sm:px-6 sm:py-8">
        {children}
      </motion.div>
    </motion.div>
  );
}
