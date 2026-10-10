import { useState } from "react";
import { motion, useReducedMotion } from "motion/react";
import { Search } from "lucide-react";
import { cn } from "@/lib/utils";
import { Input } from "@/ui/base/input";
import { DURATION, EASE_OUT } from "@/ui/pages/markets/motion/presets";

export interface FloatingSearchFieldProps {
  id: string;
  /** Texto de la etiqueta: hace de indicación dentro del campo hasta que se entra en él. */
  label: string;
  /** Ejemplo que se ve con la etiqueta ya arriba y el campo vacío. */
  placeholder: string;
  value: string;
  onValueChange: (value: string) => void;
  className?: string;
}

/** Tamaño de la etiqueta arriba respecto a su tamaño en reposo (el `S` del bloque de Bencho). */
const LIFTED_SCALE = 0.78;
/** Arriba, la etiqueta se alinea con el borde del texto del campo (de `left-9` a `left-3`). */
const LIFTED_X = -24;
/** El saltito de cada letra al enfocar, en px, y el retardo entre letras, en segundos. */
const HOP = { height: -3, duration: 0.46, step: 0.024 } as const;
const LIFT = { duration: 0.42, ease: EASE_OUT } as const;

/** Clases de la etiqueta en reposo y arriba cuando NO se usa `transform` («reducir movimiento»). */
const LABEL_REST = "left-9 h-11 text-sm";
/** Arriba: alto cero centrado en el borde superior, ya con su tamaño pequeño y alineada con el texto. */
const LABEL_LIFTED = "left-3 h-0 text-2xs";

/**
 * Buscador con etiqueta flotante, adaptado del bloque «Label input» de Bencho: la
 * etiqueta descansa dentro del campo y, al enfocar o escribir, sube al borde superior
 * con un saltito que recorre sus letras, mientras el borde se abre bajo ella desde el centro.
 *
 * Sigue siendo un `<label>` enlazado al `<input>`; todo se mueve con `transform` (la
 * etiqueta flota sobre un hueco ya reservado: no empuja nada).
 *
 * Con «reducir movimiento» nada recibe `transform` (el `MotionConfig` de la app no los
 * quita: los aplicaría de golpe): la etiqueta cambia de sitio y de tamaño por
 * posición (está en `absolute`, no empuja nada) y el hueco del borde aparece por opacidad.
 */
export function FloatingSearchField({
  id,
  label,
  placeholder,
  value,
  onValueChange,
  className,
}: FloatingSearchFieldProps) {
  const [focused, setFocused] = useState(false);
  const reducedMotion = useReducedMotion() === true;
  const lifted = focused || value.length > 0;
  const hop = focused && !reducedMotion;

  return (
    <div data-slot="markets-search-field" data-lifted={lifted} className={cn("relative", className)}>
      <Search
        aria-hidden="true"
        className="pointer-events-none absolute left-3 top-1/2 size-4 -translate-y-1/2 text-muted-foreground"
      />
      <Input
        id={id}
        type="search"
        autoComplete="off"
        placeholder={placeholder}
        value={value}
        onChange={(event) => onValueChange(event.target.value)}
        onFocus={() => setFocused(true)}
        onBlur={() => setFocused(false)}
        className="min-h-11 pl-9 placeholder:opacity-0 placeholder:transition-opacity focus:placeholder:opacity-100"
      />
      {/* El hueco del borde: del ancho de la etiqueta ya encogida, se abre desde su centro. */}
      <motion.span
        aria-hidden="true"
        className="pointer-events-none absolute -top-1.5 left-2 h-2 overflow-hidden bg-card px-1 text-2xs"
        initial={false}
        animate={reducedMotion ? { opacity: lifted ? 1 : 0 } : { scaleX: lifted ? 1 : 0 }}
        transition={{ duration: DURATION.item, ease: EASE_OUT }}
      >
        <span className="invisible whitespace-pre">{label}</span>
      </motion.span>
      <motion.label
        htmlFor={id}
        className={cn(
          "pointer-events-none absolute top-0 flex origin-left items-center whitespace-pre",
          reducedMotion && lifted ? LABEL_LIFTED : LABEL_REST,
          focused ? "text-foreground" : "text-muted-foreground",
        )}
        initial={false}
        animate={
          reducedMotion
            ? undefined
            : lifted
              ? { x: LIFTED_X, y: "-50%", scale: LIFTED_SCALE }
              : { x: 0, y: "0%", scale: 1 }
        }
        transition={LIFT}
      >
        <span className="sr-only">{label}</span>
        <span aria-hidden="true">
          {Array.from(label, (char, position) => (
            <motion.span
              // Letras de un texto fijo: nunca se reordenan.
              key={`${position}-${char}`}
              className="inline-block"
              // Con «reducir movimiento» la letra no recibe ningún `transform`.
              animate={reducedMotion ? undefined : { y: hop ? [0, HOP.height, 0] : 0 }}
              transition={{ duration: HOP.duration, times: [0, 0.38, 1], delay: hop ? position * HOP.step : 0 }}
            >
              {char}
            </motion.span>
          ))}
        </span>
      </motion.label>
    </div>
  );
}
