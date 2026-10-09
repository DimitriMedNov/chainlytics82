import { useState } from "react";
import { AnimatePresence, motion } from "motion/react";
import { DURATION, EASE_OUT, STAGGER } from "@/ui/pages/panel/motion/presets";

export interface RollingFigureProps {
  /** La cifra ya formateada: "$2,51 billones", "54.3 %", "$64.123,00". */
  text: string;
  /** El número sin formato. Solo decide hacia dónde ruedan los dígitos: si sube, entran desde abajo. */
  value?: number;
  className?: string;
}

interface Piece {
  /** Posición contada desde la derecha: un dígito nuevo a la izquierda no mueve las claves del resto. */
  key: string;
  text: string;
  isDigit: boolean;
  place: number;
}

const DIGIT = /\d/;

/** Parte el texto en dígitos sueltos (cada uno es una rueda) y tramos fijos (símbolos, separadores, palabras). */
function toPieces(text: string): Piece[] {
  const chars = Array.from(text);
  const pieces: Piece[] = [];

  chars.forEach((char, index) => {
    const place = chars.length - 1 - index;
    const last = pieces[pieces.length - 1];
    if (DIGIT.test(char)) {
      pieces.push({ key: `d${place}`, text: char, isDigit: true, place });
    } else if (last && !last.isDigit) {
      last.text += char;
      last.key = `s${place}`;
    } else {
      pieces.push({ key: `s${place}`, text: char, isDigit: false, place });
    }
  });

  return pieces;
}

/** true si el número subió (o no cambió) respecto al anterior. Sin número, rueda siempre hacia arriba. */
function useRollsUp(value: number | undefined): boolean {
  const [previous, setPrevious] = useState(value);
  const [rollsUp, setRollsUp] = useState(true);

  if (value !== previous) {
    setPrevious(value);
    setRollsUp(value === undefined || previous === undefined || value >= previous);
  }

  return rollsUp;
}

/**
 * Cifra que rueda como un cuentakilómetros cuando se refresca: solo se mueven los
 * dígitos que cambian, cada uno un instante después del que tiene a su derecha.
 * Adaptado del contador `Roll` del bloque «Like» de Bencho.
 *
 * - No anima al montar: la entrada es cosa de la tarjeta o de la fila.
 * - Quien usa lector de pantalla recibe el texto entero, no dígito a dígito.
 * - Con «reducir movimiento» el dígito no se desplaza, solo se funde (lo resuelve el
 *   `MotionConfig reducedMotion="user"` de la app, que anula los `transform`).
 * - Cada rueda ocupa el ancho de su dígito (cifras tabulares): no hay salto de layout.
 */
export function RollingFigure({ text, value, className }: RollingFigureProps) {
  const rollsUp = useRollsUp(value);
  const enterFrom = rollsUp ? "100%" : "-100%";
  const exitTo = rollsUp ? "-100%" : "100%";

  return (
    <span data-slot="rolling-figure" className={className}>
      <span className="sr-only">{text}</span>
      <span aria-hidden="true" className="whitespace-pre">
        {toPieces(text).map((piece) =>
          piece.isDigit ? (
            <span key={piece.key} className="relative inline-flex overflow-hidden align-bottom">
              <AnimatePresence initial={false} mode="popLayout">
                <motion.span
                  key={piece.text}
                  className="inline-block"
                  initial={{ y: enterFrom, opacity: 0 }}
                  animate={{ y: "0%", opacity: 1 }}
                  exit={{ y: exitTo, opacity: 0 }}
                  transition={{ duration: DURATION.item, ease: EASE_OUT, delay: piece.place * STAGGER.row }}
                >
                  {piece.text}
                </motion.span>
              </AnimatePresence>
            </span>
          ) : (
            <span key={piece.key}>{piece.text}</span>
          ),
        )}
      </span>
    </span>
  );
}
