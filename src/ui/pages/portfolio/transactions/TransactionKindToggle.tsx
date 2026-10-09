import { motion, useReducedMotion, type Variants } from "motion/react";
import { TRANSACTION_KIND_ARIA_LABEL, TRANSACTION_KIND_LABELS } from "@/application/portfolio-screen/messages";
import type { TransactionKind } from "@/domain/portfolio-screen/transactionForm";
import { ToggleGroup, ToggleGroupItem } from "@/ui/animate-ui/components/radix/toggle-group";

export interface TransactionKindToggleProps {
  value: TransactionKind;
  onChange: (kind: TransactionKind) => void;
}

const KINDS: { value: TransactionKind; label: string }[] = [
  { value: "compra", label: TRANSACTION_KIND_LABELS.compra },
  { value: "venta", label: TRANSACTION_KIND_LABELS.venta },
];

/** El rótulo de la opción elegida crece un 5 %; el otro se encoge un 4 % y se aparta 3 px. */
const GROW = 1.05;
const COWER = 0.96;
const PUSH = 3;
/** Dos muelles: el ancho llega antes que el alto, como en «Magnetic select». */
const SWELL = {
  scaleX: { type: "spring", stiffness: 520, damping: 26 },
  scaleY: { type: "spring", stiffness: 360, damping: 26 },
  x: { type: "spring", stiffness: 420, damping: 30 },
} as const;

/**
 * Estados del rótulo. Los nombra el botón (`animate`, `whileTap`) y los dibuja
 * la capa interior: el botón nunca se escala, así su área táctil no baja de 44 px.
 * `custom` es hacia dónde se aparta la opción no elegida.
 */
const LABEL_VARIANTS: Variants = {
  on: { scaleX: GROW, scaleY: GROW, x: 0, transition: SWELL },
  off: (away: number) => ({ scaleX: COWER, scaleY: COWER, x: away, transition: SWELL }),
  tap: { scale: 0.95 },
};

/**
 * Selector Compra / Venta. Adapta el `ToggleGroup` de Animate UI a las props del
 * proyecto: siempre hay una opción elegida (pulsar la activa no la desmarca).
 * Micro-interacción adaptada de «Magnetic select» de Bencho: el rótulo de la
 * opción elegida se hincha (primero a lo ancho, luego a lo alto) y empuja al
 * otro, que se encoge y se aparta. Se mueve el rótulo, no el botón. Motor:
 * Motion, el mismo del `ToggleGroup`. Con «reducir movimiento» no hay ni
 * hinchado ni empuje: solo se mueve el fondo de selección.
 */
export function TransactionKindToggle({ value, onChange }: TransactionKindToggleProps) {
  const reduceMotion = useReducedMotion() === true;

  const handleChange = (next: string) => {
    const kind = KINDS.find((option) => option.value === next);
    if (kind) onChange(kind.value);
  };

  return (
    <ToggleGroup
      type="single"
      variant="outline"
      value={value}
      onValueChange={handleChange}
      aria-label={TRANSACTION_KIND_ARIA_LABEL}
      // Cada opción ocupa la mitad: el hijo directo es el envoltorio del fondo.
      className="w-full *:flex-1"
    >
      {KINDS.map((option, index) => {
        const selected = option.value === value;
        // La primera se aparta hacia la izquierda y la segunda hacia la derecha.
        const away = index === 0 ? -PUSH : PUSH;
        return (
          <ToggleGroupItem
            key={option.value}
            value={option.value}
            className="min-h-11 w-full"
            // Pulsar la opción ya elegida no hace nada: sin esto el `ToggleGroup`
            // se quedaba sin valor por dentro y perdía el fondo de selección.
            onClick={(event) => {
              if (selected) event.preventDefault();
            }}
            initial={false}
            animate={reduceMotion ? undefined : selected ? "on" : "off"}
            // Sustituye al encogido del botón entero que trae Animate UI.
            whileTap={reduceMotion ? undefined : "tap"}
          >
            <motion.span
              className="pointer-events-none inline-flex items-center justify-center"
              variants={reduceMotion ? undefined : LABEL_VARIANTS}
              custom={away}
              initial={false}
            >
              {option.label}
            </motion.span>
          </ToggleGroupItem>
        );
      })}
    </ToggleGroup>
  );
}
