import { useId, useState, type ComponentProps } from "react";
import type { LucideIcon } from "lucide-react";
import { AnimatePresence, motion, useReducedMotion } from "motion/react";
import { Input } from "@/ui/base/input";
import {
  ERROR_EXIT,
  ERROR_HIDDEN,
  ERROR_VISIBLE,
  FADE_TRANSITION,
  HOP,
  HOP_REST,
  hopTransition,
  SHIFT_TRANSITION,
} from "@/ui/pages/auth/auth-motion";

export interface AuthFieldProps
  extends Omit<ComponentProps<"input">, "id" | "value" | "onChange" | "aria-invalid" | "aria-describedby"> {
  label: string;
  icon: LucideIcon;
  value: string;
  onValueChange(value: string): void;
  /** Mensaje de validación del campo; `null` si vale. */
  error: string | null;
}

/**
 * Campo del formulario de acceso con la etiqueta flotante de Bencho («Label input»):
 * la etiqueta hace de marcador dentro del campo y, al enfocar o al haber texto, sube
 * al borde superior, que se abre bajo ella desde el centro. Sigue siendo un `<label>`
 * asociado y siempre visible. Debajo queda reservado el hueco de un error de una
 * línea; si el error ocupa más (pantallas estrechas), el campo de debajo no salta:
 * se recoloca con `transform` (`layout="position"`).
 */
export function AuthField({
  label,
  icon: Icon,
  value,
  onValueChange,
  error,
  onFocus,
  onBlur,
  ...inputProps
}: AuthFieldProps) {
  const id = useId();
  const errorId = `${id}-error`;
  const [focused, setFocused] = useState(false);
  const reduceMotion = useReducedMotion();
  const up = focused || value.length > 0 ? "" : undefined;
  const hop = focused && reduceMotion !== true;

  return (
    <motion.div
      data-slot="auth-field"
      layout="position"
      transition={SHIFT_TRANSITION}
      className="flex flex-col gap-1.5"
    >
      <div className="relative">
        <Icon
          className="pointer-events-none absolute top-1/2 left-3 size-4 -translate-y-1/2 text-muted-foreground"
          aria-hidden="true"
        />
        <Input
          {...inputProps}
          id={id}
          value={value}
          onChange={(event) => onValueChange(event.target.value)}
          onFocus={(event) => {
            setFocused(true);
            onFocus?.(event);
          }}
          onBlur={(event) => {
            setFocused(false);
            onBlur?.(event);
          }}
          aria-invalid={error !== null}
          aria-describedby={error !== null ? errorId : undefined}
          className="peer min-h-11 bg-transparent pl-9 dark:bg-transparent"
        />
        {/* El hueco del borde: un parche del color de la tarjeta que se abre desde el centro. */}
        <span
          aria-hidden="true"
          data-up={up}
          data-slot="auth-field-notch"
          className="pointer-events-none absolute top-0 left-8 h-2 origin-center -translate-y-1/2 scale-x-0 overflow-hidden bg-card px-1 text-2xs text-transparent transition-transform duration-250 ease-out select-none peer-autofill:scale-x-100 data-up:scale-x-100 motion-reduce:transition-none"
        >
          {label}
        </span>
        <label
          htmlFor={id}
          data-up={up}
          data-slot="auth-field-label"
          className="pointer-events-none absolute inset-y-0 left-9 flex origin-left items-center text-sm text-muted-foreground transition duration-250 ease-out select-none peer-autofill:-translate-y-1/2 peer-autofill:scale-80 peer-focus:text-foreground data-up:-translate-y-1/2 data-up:scale-80 motion-reduce:transition-none"
        >
          {/* El nombre accesible es el texto entero; las letras sueltas solo se ven. */}
          <span className="sr-only">{label}</span>
          <span aria-hidden="true" className="whitespace-pre">
            {Array.from(label).map((letter, index) => (
              <motion.span
                // Las letras de una etiqueta fija no se reordenan.
                key={index}
                className="inline-block"
                initial={false}
                animate={hop ? HOP : HOP_REST}
                transition={hop ? hopTransition(index) : { duration: 0 }}
              >
                {letter}
              </motion.span>
            ))}
          </span>
        </label>
      </div>
      {/* Hueco reservado de una línea; un error más largo lo agranda y lo de abajo se desliza. */}
      <div className="min-h-4">
        <AnimatePresence initial={false}>
          {error !== null ? (
            <motion.p
              key="error"
              id={errorId}
              role="alert"
              data-slot="auth-field-error"
              initial={ERROR_HIDDEN}
              animate={ERROR_VISIBLE}
              exit={ERROR_EXIT}
              transition={FADE_TRANSITION}
              className="text-xs text-destructive"
            >
              {error}
            </motion.p>
          ) : null}
        </AnimatePresence>
      </div>
    </motion.div>
  );
}
