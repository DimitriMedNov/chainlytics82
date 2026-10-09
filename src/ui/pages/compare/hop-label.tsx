import { motion, useReducedMotion, type Variants } from "motion/react";
import { HOP, HOP_OFFSET, HOP_STAGGER } from "@/ui/pages/compare/motion";

export interface HopLabelProps {
  /** Texto de la etiqueta. */
  text: string;
  /** Cada vez que cambia (y es mayor que 0), las letras saltan una detrás de otra. */
  hop: number;
}

const LETTER: Variants = {
  rest: { y: 0 },
  hop: { y: [0, HOP_OFFSET, 0], transition: HOP },
};

/**
 * Texto de etiqueta con el saltito de Bencho «Label input»: al enfocar el campo, cada
 * letra sube un pelo y vuelve, así la palabra ondula. Solo `transform`; con «reducir
 * movimiento» no se mueve. El texto entero va aparte para los lectores de pantalla,
 * que no deben leerlo letra a letra.
 */
export function HopLabel({ text, hop }: HopLabelProps) {
  const reduced = useReducedMotion();
  const letters = Array.from(text);

  return (
    <span data-slot="hop-label">
      <span className="sr-only">{text}</span>
      <motion.span
        key={hop}
        aria-hidden="true"
        initial="rest"
        animate={hop > 0 && !reduced ? "hop" : "rest"}
        transition={{ staggerChildren: HOP_STAGGER }}
      >
        {letters.map((letter, position) => (
          // Lista fija (las letras de un texto): la posición es su identidad.
          <motion.span key={position} variants={LETTER} className="inline-block whitespace-pre">
            {letter}
          </motion.span>
        ))}
      </motion.span>
    </span>
  );
}
