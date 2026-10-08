import type { ComponentProps } from "react";
import { motion } from "motion/react";
import { Panel } from "@/ui/shared";
import { SECTION, SECTION_OFFSET, SECTION_STAGGER } from "@/ui/pages/compare/motion";

/** El mismo `Panel` (misma etiqueta, mismas props), animable por Motion. */
const MotionPanel = motion.create(Panel);

export interface RevealPanelProps extends ComponentProps<typeof MotionPanel> {
  /** Puesto en la entrada escalonada de la página: 0 entra primero. */
  order?: number;
}

/**
 * `Panel` que entra al abrir la pantalla: fundido y una subida corta, escalonado con
 * sus vecinos por `order`. Orienta la lectura (selección → gráfica → clasificación).
 * No bloquea: el contenido se puede usar mientras entra. Sus partes siguen siendo
 * `Panel.Header`, `Panel.Body`...
 */
export function RevealPanel({ order = 0, ...props }: RevealPanelProps) {
  return (
    <MotionPanel
      initial={{ opacity: 0, y: SECTION_OFFSET }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ ...SECTION, delay: order * SECTION_STAGGER }}
      {...props}
    />
  );
}
