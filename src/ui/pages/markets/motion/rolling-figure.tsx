import { useState } from "react";
import { AnimatePresence, motion } from "motion/react";
import { DURATION, EASE_OUT, STAGGER } from "@/ui/pages/markets/motion/presets";

export interface RollingFigureProps {
  /** El texto ya escrito: «37 criptomonedas». */
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
  /** Para un dígito, cuántos dígitos tiene a su derecha (unidades = 0): decide cuánto espera para rodar. */
  order: number;
}

const DIGIT = /\d/;

/** Parte el texto en dígitos sueltos (cada uno es una rueda) y tramos fijos (palabras, separadores). */
function toPieces(text: string): Piece[] {
  const chars = Array.from(text);
  const pieces: Piece[] = [];

  chars.forEach((char, index) => {
    const place = chars.length - 1 - index;
    const last = pieces[pieces.length - 1];
    if (DIGIT.test(char)) {
      pieces.push({ key: `d${place}`, text: char, isDigit: true, order: 0 });
    } else if (last && !last.isDigit) {
      last.text += char;
      last.key = `s${place}`;
    } else {
      pieces.push({ key: `s${place}`, text: char, isDigit: false, order: 0 });
    }
  });

  // El retraso se cuenta entre dígitos, no entre letras: en «37 criptomonedas» las unidades ruedan ya.
  let digitsToTheRight = 0;
  for (let index = pieces.length - 1; index >= 0; index -= 1) {
    const piece = pieces[index];
    if (piece?.isDigit) {
      piece.order = digitsToTheRight;
      digitsToTheRight += 1;
    }
  }

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
 * Cifra que rueda como un cuentakilómetros cuando cambia: solo se mueven los dígitos
 * que cambian. Copia local del modelo del Panel (adaptado del contador `Roll` del
 * bloque «Like» de Bencho).
 *
 * - No anima al montar.
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
      <span aria-hidden="true" className="type-num whitespace-pre">
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
                  transition={{ duration: DURATION.item, ease: EASE_OUT, delay: piece.order * STAGGER.row }}
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
