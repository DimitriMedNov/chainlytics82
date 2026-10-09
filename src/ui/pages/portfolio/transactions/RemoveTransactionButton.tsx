import { useState } from "react";
import { Check, Trash2 } from "lucide-react";
import { motion } from "motion/react";
import { Button } from "@/ui/animate-ui/components/buttons/button";

/** Cara que se va: fundido corto (el `exit` de 80 ms de Bencho). */
const FACE_OUT = { duration: 0.08 };
/** Cara que llega: fundido con un pequeño retraso, como en el original. */
const FACE_IN = { duration: 0.18, delay: 0.06 };

export interface RemoveTransactionButtonProps {
  /** Nombre accesible completo (`removeTransactionAriaLabel(...)`). */
  label: string;
  /** Borra el movimiento. Se llama una sola vez, en el mismo clic. */
  onRemove: () => void;
  className?: string;
}

/**
 * Papelera de un movimiento. Micro-interacción adaptada de «Inline confirm» de
 * Bencho: una sola pulsación borra al momento (sin paso de confirmación) y el
 * propio botón, sin moverse de sitio, cambia la papelera por una marca de
 * «hecho»; la fila espera a que se vea antes de irse (`useItemMotion`). El «Deshacer» del original no se trae: la
 * pantalla no tiene acción para restaurar un movimiento. Motor: Motion.
 */
export function RemoveTransactionButton({ label, onRemove, className }: RemoveTransactionButtonProps) {
  const [done, setDone] = useState(false);

  const handleClick = () => {
    // La fila sigue montada mientras sale: un segundo clic no borra otra vez.
    if (done) return;
    setDone(true);
    onRemove();
  };

  return (
    <Button
      type="button"
      variant="ghost"
      size="icon"
      className={className}
      aria-label={label}
      data-phase={done ? "done" : "idle"}
      onClick={handleClick}
    >
      <span className="relative flex size-4 items-center justify-center">
        <motion.span
          className="absolute inset-0 flex items-center justify-center text-destructive"
          initial={false}
          animate={{ opacity: done ? 0 : 1 }}
          transition={FACE_OUT}
        >
          <Trash2 aria-hidden="true" />
        </motion.span>
        <motion.span
          className="absolute inset-0 flex items-center justify-center text-muted-foreground"
          initial={false}
          animate={{ opacity: done ? 1 : 0, scale: done ? 1 : 0.7 }}
          transition={FACE_IN}
        >
          <Check aria-hidden="true" />
        </motion.span>
      </span>
    </Button>
  );
}
