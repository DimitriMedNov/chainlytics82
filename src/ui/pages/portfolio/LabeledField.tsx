import { useState, type ReactNode } from "react";
import { motion, useReducedMotion } from "motion/react";
import { cn } from "@/lib/utils";
import { Label } from "@/ui/base/label";

/** Salto de cada letra: sube 3 px y vuelve (el `lbi-hop` de Bencho). */
const HOP = { y: [0, -3, 0] };
const REST = { y: 0 };
/** Retraso entre una letra y la siguiente, en segundos. */
const LETTER_DELAY = 0.024;

export interface LabeledFieldProps {
  /** `id` del control: lo enlaza con su etiqueta. */
  htmlFor: string;
  /** Texto de la etiqueta (constante de `messages`). */
  label: string;
  /** El control: `Input`, `Select`… */
  children: ReactNode;
  className?: string;
}

/**
 * Etiqueta + control de un formulario. Micro-interacción adaptada de «Label
 * input» de Bencho: al entrar el foco en el campo, las letras de la etiqueta
 * dan un salto corto una tras otra, para decir «estás aquí». La etiqueta se
 * queda arriba (no flota): los campos de esta pantalla tienen su propio
 * `placeholder`, que no se puede tapar. Motor: Motion. Con «reducir
 * movimiento» no hay salto.
 */
export function LabeledField({ htmlFor, label, children, className }: LabeledFieldProps) {
  const [focused, setFocused] = useState(false);
  const reduceMotion = useReducedMotion() === true;
  const hop = focused && !reduceMotion;

  return (
    <div
      data-slot="labeled-field"
      data-focus={focused}
      className={cn("flex min-w-0 flex-col gap-2", className)}
      onFocus={() => setFocused(true)}
      onBlur={() => setFocused(false)}
    >
      <Label htmlFor={htmlFor}>
        {/* Un solo hijo: el `gap` de `Label` no separa las letras. */}
        <span className="whitespace-pre">
          {Array.from(label).map((letter, index) => (
            <motion.span
              // El texto de una etiqueta no se reordena: el índice es estable.
              key={index}
              className="inline-block"
              initial={false}
              animate={hop ? HOP : REST}
              transition={
                hop
                  ? { duration: 0.46, times: [0, 0.38, 1], ease: "easeOut", delay: index * LETTER_DELAY }
                  : { duration: 0 }
              }
            >
              {letter}
            </motion.span>
          ))}
        </span>
      </Label>
      {children}
    </div>
  );
}
